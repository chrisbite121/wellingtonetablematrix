import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { DummyData } from './data/dummyData'
import * as React from 'react';
import * as ReactDOM from "react-dom";
import { App } from './App';
import { config } from "process";

var AsyncLock = require('async-lock');

interface idata {
	x:number;
	y:number;
	title:string;
}

export class wellingtonetablematrix implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private prod: boolean;
	private dummyDataHelper: any;
	private _lock: any;
	private _container: HTMLDivElement;
	private _rawData: any;
	private _data: any;
	private _config: any;
	private _recordId: string;
	private _props: any;

	constructor(){}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
	{
		//determine if we are in the test harness
		context.parameters.matrixTable.raw == 'val'
		? this.prod = false
		: this.prod = true;

		this._container = container;
		this._lock = new AsyncLock();
		this.dummyDataHelper = new DummyData();
		//get the current record id;
		this._recordId = (<any>context.mode).contextInfo.entityId;
		context.client.disableScroll = false;
		context.mode.trackContainerResize(true);
		this.renderControl(context);
	}

	private renderControl(context: ComponentFramework.Context<IInputs>) : void
	{
		this._lock.acquire('init', async () => {
			this._config = this.processConfig(context);
			if(this.prod)
			{
				if (context.updatedProperties.includes("controlProperties")) {
					let tableName = (<any>this._config).tableName;
					let fields = (<any>this._config).itemTitle + ',' + (<any>this._config).xFieldName + ',' + (<any>this._config).yFieldName;
					let parentFieldLookupName = (<any>this._config).parentFieldLookupName;
					let filters = this.processFilters(<any>(this._config)?.filterRules);
					this._rawData = await this.getTableData(context, tableName, fields, this._recordId, parentFieldLookupName, filters.filters, filters.filterFields);
				}
			} else {
				this._rawData = this.dummyDataHelper.dummyData
			}
		
		}).then(() => {
			if (this._rawData) {
				this._props = this.processData(this._rawData, this._config);
				ReactDOM.render(
					React.createElement(App, this._props),
					this._container
				);
			}
		});
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// if (context.updatedProperties.includes("controlProperties") ||
		// 	context.updatedProperties.includes("Layout")
		// ) {
			this.renderControl(context);
		// }
	}

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/**
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}

	private processFilters(filterRules: Array<Array<string | number>>): {filters: string; filterFields:string}
	{
		let filters = '';
		let filterFields = '';
		if (!filterRules || filterRules.length == 0) return {filters: '', filterFields: ''}

		for(var i=0; i< filterRules.length; i++)
		{
			if (i !== 0) 
				filters += ` and `
			
			switch(filterRules[i][1]) {
				case '==':
					filters += `(${filterRules[i][0]} eq ${filterRules[i][2]})`
				break;
				case '>':
					filters += `(${filterRules[i][0]} gt ${filterRules[i][2]})`
				break;
				case '<':
					filters += `(${filterRules[i][0]} lt ${filterRules[i][2]})`
				break;
			}
			
			if(i==0) {
				filterFields += filterRules[i][0];
			} else {
				filterFields += `,${filterRules[i][0]}`
			}
		}
		return {filters, filterFields};
	}

	private getTableData(context: ComponentFramework.Context<IInputs>, tableName:string, fields:string, recordId:string, parentFieldLookupName:string, filters:string, filterFields:string):Promise<Array<any>> {
		// https://org3701e36e.crm5.dynamics.com/api/data/v9.1/
		let filter = '';
		if (filters.length > 0) {
			filter += `(_${parentFieldLookupName}_value eq ${recordId}) and ${filters}`
		} else {
			filter = `_${parentFieldLookupName}_value eq ${recordId}`
		}

		let select = '';
		if(filterFields.length > 0) {
			select = `${fields},_${parentFieldLookupName}_value,${filterFields}`
		} else {
			select = `${fields},_${parentFieldLookupName}_value`
		}
		let odataEndPoint = `?$select=${select}&$filter=${filter}`;

		return new Promise((resolve, reject) => {
			// context.webAPI.retrieveMultipleRecords('msdyn_projectrisk', `?$select=msdyn_name,wmencap_impact,wmencap_probability,wmencap_exposure,_msdyn_project_value&$filter=_msdyn_project_value eq 9a4e039a-45a2-eb11-b1ac-0022489c1375`, 10000)
			context.webAPI.retrieveMultipleRecords(tableName, odataEndPoint, 10000)
			.then((res) => {
				if(res &&
					res.entities) {
						resolve(res.entities as Array<any>)
					}
			},
			(err) => {
				console.log(err);
				reject();
			});
		})
	}

	private processConfig(context: ComponentFramework.Context<IInputs>)
	{
		let config = {};

		if(context.parameters.controlProperties.raw)
			 config = JSON.parse(context.parameters.controlProperties.raw)
		
		//determine appropiate width 
		let allocatedWidth = +context.mode.allocatedWidth;
		if (allocatedWidth > 0 &&
			 (<any>config).maxWidth > allocatedWidth)
		{
			//update aspect ratio
			let aspectRatio = allocatedWidth / (<any>config).maxWidth;
			(<any>config).maxWidth = allocatedWidth;
			(<any>config).maxHeight = aspectRatio * (<any>config).maxHeight;
		}
		return config;

	}

	private processData(data: any, config: any) 
	{
		//   const xAxis:Array<number> = Array.from({ length: (config.xRange[1] - config.xRange[0]) + 1}, (_, i) => config.xRange[0] + (i));
		//   const yAxis:Array<number> = Array.from({ length: (config.yRange[1] - config.yRange[0]) + 1}, (_, i) => config.yRange[0] + (i));

		const xAxis = config.xDomain;
		const yAxis = config.yRange;

		const summaryData:Array<any> = []



		xAxis.forEach((x:any,i:number) => {
			yAxis.forEach((y:any,i:number) => {
			summaryData.push( {
				x,
				y,
				colour: this.getColour(x, y, config.colourRules),
				count: 0
			})
			});
		});

		const itemData = data.map((item: any) => {
			let _xVal = item[config.xFieldName];
			let _yVal = item[config.yFieldName];

			//if using optionsets replace internal number values with mapped display values
			if (config.choiceFieldMapping
			&& typeof(config.choiceFieldMapping) == 'object' 
			&& Object.keys(config.choiceFieldMapping).length > 0)
			{
				if(config.choiceFieldMapping[_xVal.toString()])
					_xVal = config.choiceFieldMapping[_xVal.toString()];
				
				if(config.choiceFieldMapping[_yVal.toString()])
					_yVal = config.choiceFieldMapping[_yVal.toString()];
			}

			return {
				x: _xVal,
				y: _yVal,
				title: item[config.itemTitle]
			} as idata;
		});

		//add total value
		itemData.forEach((item:any) => {
			summaryData.filter(entry => {
			return entry.x == item.x && entry.y == item.y
			})[0]
			.count ++;
		})

		const groupedData = itemData.reduce((groupedRisks:any, item:any, index:number, array:Array<any>) => {
			const group = item.x.toString() + '-' + item.y.toString();

			if(groupedRisks[group] == null) groupedRisks[group] = [];

			groupedRisks[group].push(item)
			return groupedRisks
		}, {})
		
		return {
			summaryData, itemData, groupedData, config
		}
	}

	private getColour = (x:number, y: number, colours:Array<any>) => {
		for(var i =0; i<colours.length; i++) {
			switch(colours[i].length) {
			case(2):
			//where a rule of length 2 is defined
			//it is assumed the 2 measures are numbers
				if((+x)*(+y) <= colours[i][0]) {
				return colours[i][1];
				}
			break;
			case(3):
			//if rule is of length 3 then we can handle string or number values
				if(x == colours[i][0] && y == colours[i][1]) {
				return colours[i][2];
				}
			break;
			}
		}
		return "#ffffff";
	}
}
