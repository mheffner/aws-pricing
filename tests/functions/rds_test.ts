import { TestSuite } from "../_framework/test_suite";
import { TestRun } from "../_framework/test_run";
import { RDS_AURORA_MYSQL_OD, RDS_AURORA_MYSQL_RI, RDS_AURORA_MYSQL_RI_NO, RDS_AURORA_MYSQL_RI_PARTIAL, RDS_AURORA_MYSQL_RI_ALL, RDS_AURORA_POSTGRESQL_OD, RDS_MARIADB_OD, RDS_POSTGRESQL_OD, RDS_MYSQL_OD, RDS_AURORA_MYSQL, RDS_MARIADB_RI, RDS_AURORA_POSTGRESQL_RI, RDS_MYSQL_RI, RDS_POSTGRESQL_RI } from "../../src/functions/gen/rds_gen";

export class RDSFunctionTestSuite extends TestSuite {
    protected name(): string {
        return this.constructor.name
    }
    
    protected run(t: TestRun): void {
        t.describe("RDS func tests", () => {
            t.areEqual(0.58, RDS_AURORA_MYSQL_OD("db.r5.xlarge", "us-east-1"))
            t.areClose(0.379999, RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 1, "no_upfront"), 0.000001)
            t.areClose(0.322694, RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 1, "partial_upfront"), 0.000001)
            t.areClose(0.316210, RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 1, "all_upfront"), 0.000001)

            t.willThrow(function() {
                RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 3, "no_upfront")
            }, "not supported")
            t.areClose(0.215129, RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 3, "partial_upfront"), 0.000001)
            t.areClose(0.202207, RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 3, "all_upfront"), 0.000001)

            t.areClose(0.379999, RDS_AURORA_MYSQL_RI_NO("db.r5.xlarge", "us-east-1", 1), 0.000001)
            t.areClose(0.322694, RDS_AURORA_MYSQL_RI_PARTIAL("db.r5.xlarge", "us-east-1", 1), 0.000001)
            t.areClose(0.316210, RDS_AURORA_MYSQL_RI_ALL("db.r5.xlarge", "us-east-1", 1), 0.000001)

            t.areEqual(1.16, RDS_AURORA_POSTGRESQL_OD("db.r5.2xlarge", "us-east-1"))
            t.areEqual(1.04, RDS_MARIADB_OD("db.r5.2xlarge", "ca-central-1"))
            t.areEqual(1.0810, RDS_POSTGRESQL_OD("db.r5.2XLARGE", "CA-CENTRAL-1"))
            t.areEqual(1.04, RDS_MYSQL_OD("db.r5.2xlarge", "ca-central-1"))

            // Verify all RI purchase types to ensure payload sizes fit in cache
            t.areClose(0.404452, RDS_AURORA_POSTGRESQL_RI("db.r5.2xlarge", "us-east-1", 3, "all_upfront"), 0.000001)
            t.areClose(0.348097, RDS_MARIADB_RI("db.r5.2xlarge", "us-east-1", 3, "all_upfront"), 0.000001)
            t.areClose(0.348097, RDS_MYSQL_RI("db.r5.2xlarge", "us-east-1", 3, "all_upfront"), 0.000001)
            t.areClose(0.362595, RDS_POSTGRESQL_RI("db.r5.2xlarge", "us-east-1", 3, "all_upfront"), 0.000001)
        })

        t.describe("RDS settings tests", () => {
            let s = [
                ['region', 'us-east-2'],
                ['purchase_type', 'ondemand']
            ]

            t.areEqual(0.58, RDS_AURORA_MYSQL(s, "db.r5.xlarge"))
            t.areEqual(0.64, RDS_AURORA_MYSQL(s, "db.r5.xlarge", "ca-central-1"))

            s = [
                ['region', 'us-east-1'],
                ['purchase_type', 'reserved'],
                ['purchase_term', '1'],
                ['payment_option', 'partial_upfront']
            ]

            t.areClose(0.322694, RDS_AURORA_MYSQL(s, "db.r5.xlarge"), 0.000001)
            s[3][1] = 'all_upfront'
            t.areClose(0.316210, RDS_AURORA_MYSQL(s, "db.r5.xlarge"), 0.000001)
        })

        t.describe("RDS invalid settings", () => {
            let s = [
                ['region', 'us-east-1'],
                ['purchase_type', 'reserved'],
                ['purchase_term', '1'],
                ['payment_option', 'partial_upfront']
            ]

            t.willThrow(function() {
                RDS_AURORA_MYSQL(s, "db.r1.2xlarge")
            }, "unable to find")

            t.willThrow(function() {
                RDS_AURORA_MYSQL(s, undefined)
            }, "must specify a db instance")

            t.willThrow(function() {
                RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 2, "no_upfront")
            }, "purchase_term")
        })
    }

}
