import * as ActionTypes from '../constants/actionTypes';
import * as ActionCreators from './nodes';
import fetch from 'cross-fetch';
import { buildResponseBlock } from '../utils/tests/buildResponseBlock';

jest.mock('cross-fetch');

describe('Actions', () => {
  beforeAll(() => {
  });
  afterAll(() => {
  });

  const node = {
    url: 'http://localhost:3002',
    online: false,
    name: null
  };

  // it('should create an action to start checking node status', () => {
  //   const actual = ActionCreators.checkNodeStatusStart(node);
  //   const expected = {
  //     type: ActionTypes.CHECK_NODE_STATUS_START,
  //     node
  //   };
  //
  //   expect(actual).toEqual(expected);
  // });

  it('should create an action to save fuel savings', () => {
    const dispatch = jest.fn();
    const expected = {
      type: ActionTypes.CHECK_NODE_STATUS_START,
      node
    };

    // we expect this to return a function since it is a thunk
    expect(typeof (ActionCreators.checkNodeStatus(node))).toEqual('function');
    // then we simulate calling it with dispatch as the store would do
    ActionCreators.checkNodeStatus(node)(dispatch);
    // finally assert that the dispatch was called with our expected action
    expect(dispatch).toBeCalledWith(expected);
  });

  describe('fetchNodeBlocks', () => {
    beforeEach(() => {
      fetch.mockClear();
    });

    it('handles correctly when request succeeds', async () => {
      const dispatch = jest.fn();
      const data = [
        buildResponseBlock(),
      ];
      fetch.mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({ data }),
      }));

      const promise = ActionCreators.fetchNodeBlocks(node)(dispatch);
      expect(dispatch).toBeCalledWith({
        type: ActionTypes.FETCH_NODE_BLOCKS_START,
        node,
      });

      dispatch.mockClear();
      await promise;

      expect(dispatch).toBeCalledWith({
        type: ActionTypes.FETCH_NODE_BLOCKS_SUCCESS,
        node,
        data,
      });
    });

    it('handles correctly when request fails', async () => {
      const dispatch = jest.fn();
      const error = new Error();
      fetch.mockImplementation(() => Promise.reject(error));

      const promise = ActionCreators.fetchNodeBlocks(node)(dispatch);
      expect(dispatch).toBeCalledWith({
        type: ActionTypes.FETCH_NODE_BLOCKS_START,
        node,
      });

      dispatch.mockClear();
      await promise;

      expect(dispatch).toBeCalledWith({
        type: ActionTypes.FETCH_NODE_BLOCKS_FAILURE,
        node,
        error,
      });
    })
  });
});
