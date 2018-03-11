import { net } from 'electron';
import { REQUEST_END } from './actionTypes';

class DbAgent {
  constructor() {
    ['get', 'post', 'put', 'delete'].forEach((method) => {
      this[method] = ({ uri, form, query = {} }) => new Promise((resolve, reject) => {
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
    });
  }
}

const agent = new DbAgent();

export const onRequest = async (state, event, { method, form, query, uri }) => {
  const resp = await agent[method]({ form, query, uri });

  event.sender.send(REQUEST_END, resp);

  return state;
};
