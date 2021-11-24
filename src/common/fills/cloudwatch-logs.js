
/*
  This exists because the structure of aws-amplify causes rollup to import the
  entirety of @aws-sdk/client-cloudwatch-logs, which we do not use at all in
  this project. Replacing it with this file saves us 460k on the final build.
 */

export const CloudWatchLogsClient = null;
export const CreateLogGroupCommand = null;
export const CreateLogStreamCommand = null;
export const DescribeLogGroupsCommand = null;
export const DescribeLogStreamsCommand = null;
export const GetLogEventsCommand = null;
export const PutLogEventsCommand = null;
