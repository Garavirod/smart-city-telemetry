import { RemovalPolicy } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { DynamoTableNames } from './types';


export class DynamoTableServices {
    private scope:any;
    public tables:Record<DynamoTableNames, dynamodb.Table>
    constructor(scope:any){
        this.tables = {...this.tables};
        this.scope = scope;
        this.creteTables();
    }

    private creteTables(){
        // Users table
        this.tables[DynamoTableNames.Users] = new dynamodb.Table(this.scope, DynamoTableNames.Users,{
            partitionKey: {
                name: 'user_id',
                type: dynamodb.AttributeType.STRING,
            },
            removalPolicy: RemovalPolicy.DESTROY
        });
        // Define more tables as needed
    }

    public get GetTables(){
        return this.tables;
    }
}
