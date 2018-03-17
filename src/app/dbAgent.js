// @flow
import { net } from 'electron';

export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';
export const DELETE = 'delete';

type HttpMethod =
  | typeof GET
  | typeof POST
  | typeof PUT
  | typeof DELETE;

type AgentOptions = {
  uri: string,
  form?: mixed,
  query?: {}
};

type AgentRequest = AgentOptions => Promise<*>;

type Agent = {
  [HttpMethod]: AgentRequest
};

const agentRequest =
  (method: HttpMethod) =>
    (options: AgentOptions) =>
      new Promise((resolve, reject) => {
        const { uri, form = {}, query = {} } = options;
        const qs = Object.keys(query).reduce((total, key, index) => (
          index === 0
            ? `?${key}=${query[key]}`
            : `&${key}=${query[key]}`
        ), '');

        const request = net.request({
          method,
          protocol: 'http:',
          hostname: 'localhost',
          path: `${uri}${qs}`,
          port: 3001,
        });

        request.setHeader('content-type', 'application/json');

        request.on('response', (response) => {
          let data = '';
          response.on('data', (chunk) => {
            data += chunk.toString();
          });

          response.on('end', () => resolve(data));
        });

        request.on('error', reject);
        request.write(JSON.stringify(form), 'utf-8');
        request.end();
      });

const agent: Agent = {
  [GET]: agentRequest(GET),
  [POST]: agentRequest(POST),
  [PUT]: agentRequest(PUT),
  [DELETE]: agentRequest(DELETE),
};

export default agent;
