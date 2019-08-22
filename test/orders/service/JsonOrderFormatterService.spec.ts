import { expect } from 'chai';
import * as AppRootPath from 'app-root-path';
import * as fs from 'fs';

import * as singleOrder from '../resources/singleOrder';
import JsonOrderFormatterService from '../../../src/orders/service/JsonOrderFormatterService';

describe('JsonOrderFormatterService', () => {
  describe('Given a JSON string', () => {
    describe('without required order properties', () => {
      it('Throw an error', () => {
        try {
          JsonOrderFormatterService.formatOrder('{"id":"order-id"}');
        } catch (e) {
          expect(e.message).to.equal('Cannot read property \'map\' of undefined');
        }
      });
    });

    describe('with all required order properties', () => {
      it('Return an Order', () => {
        return new Promise((resolve, reject) => {
          fs.readFile(`${AppRootPath}/test/orders/resources/singleOrderJson.json`, (err, data) => {
            if (err) {
              reject(err);
              return;
            }
            const validOrderJson = data.toString();
            try {
              const order = JsonOrderFormatterService.formatOrder(validOrderJson);
              expect(order.id).to.equal('c0f45529-cbed-4e90-9a38-c208d409ef2a');
              expect(order.updatedAt.getFullYear()).to.equal(2018);
              resolve();
            } catch (e) {
              reject(e);
            }
          });
        });
      });
    });
  });

  describe('Given an object', () => {
    describe('without required order properties', () => {
      it('Throw an error', () => {
        try {
          JsonOrderFormatterService.formatOrder({ id : 'order-id' });
        } catch (e) {
          expect(e.message).to.equal('Cannot read property \'map\' of undefined');
        }
      });
    });

    describe('with all required order properties', () => {
      it('Return an Order', () => {
        const order = JsonOrderFormatterService.formatOrder(singleOrder.default);
        expect(order.id).to.equal('c0f45529-cbed-4e90-9a38-c208d409ef2a');
        expect(order.updatedAt.getFullYear()).to.equal(2018);
      });
    });
  });
});
