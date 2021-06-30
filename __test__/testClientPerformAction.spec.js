// import js 
import { performAction, performReturnAction } from '../src/client/js/app'

describe("Testing if the clicking the search works", () => {
    it("Testing the performAction function", () => {
        expect(performAction).toBeDefined();
            });
    it("Testing if performAction  is a function",  () => {
        expect(typeof performAction).toBe('function');
    });
  });


  describe("Testing if the clicking the return works", () => {
    it("Testing the performReturnAction function", () => {
        expect(performReturnAction).toBeDefined();
            });
    it("Testing if performReturnAction  is a function",  () => {
        expect(typeof performReturnAction).toBe('function');
    });
  });