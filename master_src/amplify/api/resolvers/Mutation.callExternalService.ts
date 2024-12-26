import { Context } from '@aws-appsync/utils';
import { util } from '@aws-appsync/utils';

export function request(ctx: Context) {
  const { service, feature, method, data, organizationId } = ctx.arguments.input;
  
  // Validate service access based on organization subscription
  const orgDetails = util.dynamodb.get({
    key: { id: organizationId },
    tableName: ctx.env.ORGANIZATION_TABLE
  });
  
  if (!orgDetails.subscription.features.includes(service)) {
    util.error('Service not available in current subscription tier');
  }

  // Route to appropriate service handler
  switch (service) {
    case 'hospitalRun':
      return handleHospitalRun(feature, method, data);
    case 'goAlert':
      return handleGoAlert(feature, method, data);
    case 'healthcareCRM':
      return handleHealthcareCRM(feature, method, data);
    case 'localLLM':
      return handleLocalLLM(feature, method, data);
    default:
      util.error(`Unknown service: ${service}`);
  }
}

function handleLocalLLM(feature: string, method: string, data: any) {
  // Local LLM processing will be handled through AppSync Direct Lambda
  return {
    operation: 'Invoke',
    payload: {
      field: 'localLLMProcess',
      arguments: {
        feature,
        method,
        data
      }
    }
  };
}

export function response(ctx: Context) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result;
} 