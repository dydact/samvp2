import { defineBackend } from '@aws-amplify/backend';
import { schema } from '../../../SiteAware/shared/src/schema';

const backend = defineBackend({
  schema
});