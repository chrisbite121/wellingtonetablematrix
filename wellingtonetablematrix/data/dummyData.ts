
export class DummyData {
    private _dummyData: any;
    
    constructor() {
        this._dummyData = this.generateDummyData();
    }

    public get dummyData() {
        return this._dummyData;
    }

    private generateDummyData() {
        return [
            {
                "@odata.etag": "W/\"4865320\"",
                "msdyn_name": "dev risk 1",
                "w_impact@OData.Community.Display.V1.FormattedValue": "4",
                "w_impact": 4,
                "w_probability@OData.Community.Display.V1.FormattedValue": "3",
                "w_probability": 3,
                "w_exposure": 12,
                "_msdyn_project_value@OData.Community.Display.V1.FormattedValue": "DEV Project 1",
                "_msdyn_project_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "msdyn_Project",
                "_msdyn_project_value@Microsoft.Dynamics.CRM.lookuplogicalname": "msdyn_project",
                "_msdyn_project_value": "9a4e039a-45a2-eb11-b1ac-0022489c1375",
                "msdyn_projectriskid": "393ce202-63e8-eb11-bacb-000d3ada3b4b"
            },
            {
                "@odata.etag": "W/\"4865329\"",
                "msdyn_name": "dev risk 2",
                "w_impact@OData.Community.Display.V1.FormattedValue": "5",
                "w_impact": 5,
                "w_probability@OData.Community.Display.V1.FormattedValue": "5",
                "w_probability": 5,
                "w_exposure": 25,
                "_msdyn_project_value@OData.Community.Display.V1.FormattedValue": "Dev Project 2",
                "_msdyn_project_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "msdyn_Project",
                "_msdyn_project_value@Microsoft.Dynamics.CRM.lookuplogicalname": "msdyn_project",
                "_msdyn_project_value": "9a4e039a-45a2-eb11-b1ac-0022489c1375",
                "msdyn_projectriskid": "7b2c4809-63e8-eb11-bacb-000d3ada3b4b"
            },
            {
                "@odata.etag": "W/\"4865340\"",
                "msdyn_name": "dev risk 3",
                "w_impact@OData.Community.Display.V1.FormattedValue": "1",
                "w_impact": 1,
                "w_probability@OData.Community.Display.V1.FormattedValue": "2",
                "w_probability": 2,
                "w_exposure": 2,
                "_msdyn_project_value@OData.Community.Display.V1.FormattedValue": "Dev Project 3",
                "_msdyn_project_value@Microsoft.Dynamics.CRM.associatednavigationproperty": "msdyn_Project",
                "_msdyn_project_value@Microsoft.Dynamics.CRM.lookuplogicalname": "msdyn_project",
                "_msdyn_project_value": "9a4e039a-45a2-eb11-b1ac-0022489c1375",
                "msdyn_projectriskid": "0d30891b-63e8-eb11-bacb-000d3ada3b4b"
            }
        ]
    }


}

