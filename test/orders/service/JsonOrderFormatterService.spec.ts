import { expect } from 'chai';
import * as AppRootPath from 'app-root-path';
import * as fs from 'fs';

import * as singleOrder from '../resources/singleOrder';
import JsonOrderFormatterService from '../../../src/orders/service/JsonOrderFormatterService';
import { fail } from 'assert';

describe('JsonOrderFormatterService', () => {
  describe('Given a JSON string', () => {
    describe('without required order properties', () => {
      it('Throw an error', () => {
        try {
          JsonOrderFormatterService.formatOrder('{"id":"order-id"}');
        } catch (e) {
          // @ts-ignore
          expect(e.message).to.equal("Cannot read property 'map' of undefined");
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
              // @ts-ignore
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
          JsonOrderFormatterService.formatOrder({ id: 'order-id' });
          fail('Expected exception to be thrown but none occurred');
        } catch (e) {
          // @ts-ignore
          expect(e.message).to.equal("Cannot read property 'map' of undefined");
        }
      });
    });

    describe('with all required order properties', () => {
      it('Return an Order', () => {
        const anyOrder = JSON.parse(JSON.stringify(singleOrder.default));
        anyOrder.lineItems[0].taxes[0].price = '9.99';
        anyOrder.lineItems[0].taxes[0].rate = '0.06';
        anyOrder.lineItems[0].taxes[1].price = '1.00';
        const order = JsonOrderFormatterService.formatOrder(JSON.stringify(anyOrder));
        expect(order.id).to.equal('c0f45529-cbed-4e90-9a38-c208d409ef2a');
        expect(order.updatedAt.getFullYear()).to.equal(2018);
        expect(order.lineItems.length).to.equals(2);
        expect(order.lineItems[0].taxes).to.not.be.undefined;
        // @ts-ignore
        expect(order.lineItems[0].taxes[0].price).to.equals(Number(9.99));
        // @ts-ignore
        expect(order.lineItems[0].taxes[0].rate).to.equals(Number(0.06));
        // @ts-ignore
        expect(order.lineItems[0].taxes[0].title).to.equals('PA State Tax');
        // @ts-ignore
        expect(order.lineItems[0].taxes[1].price).to.equals(Number(1.00));
        // @ts-ignore
        expect(order.lineItems[0].taxes[1].rate).to.be.undefined;
        // @ts-ignore
        expect(order.lineItems[0].taxes[1].title).to.equals('NV State Tax');
      });
    });

    describe('with bad user input of leading or trailing whitespace', () => {
      it('Return an Order with trimmed fields', () => {
        const badSingleOrder = JSON.parse(JSON.stringify(singleOrder.default));
        badSingleOrder.customer.name = '                    ';
        badSingleOrder.customer.email = 'Aurore.Purdy17@gmail.com     ';
        badSingleOrder.customer.phone = ' 555-555-5555  ';
        badSingleOrder.customer.shippingAddress.address2 = '    ';
        badSingleOrder.customer.shippingAddress.city = '    South Deanhaven';
        const order = JsonOrderFormatterService.formatOrder(badSingleOrder);
        const trimmedRegex = /^\S.*\S$/;
        expect(order.customer).to.exist;
        if (order.customer) {
          expect(order.customer.name).to.be.empty;
          expect(order.customer.email).to.match(trimmedRegex);
          expect(order.customer.phone).to.match(trimmedRegex);
          expect(order.customer.shippingAddress).to.exist;
          if (order.customer.shippingAddress) {
            expect(order.customer.shippingAddress.address2).to.be.empty;
            expect(order.customer.shippingAddress.city).to.match(trimmedRegex);
          }
        }
      });
    });
  });
});
