import { StackProps } from "aws-cdk-lib";

export interface BaseStackProps extends StackProps {
    stage: string
    serviceName: string
}
