import * as ActionTypes from '../constants/actionTypes';
import reducer from './nodes';
import initialState from './initialState';
import { buildResponseBlock } from '../utils/tests/buildResponseBlock';

describe('Reducers::Nodes', () => {
  const getInitialState = () => {
    return initialState().nodes;
  };

  const nodeA = {
    url: 'http://localhost:3002',
    online: false,
    name: null
  };

  const nodeB = {
    url: 'http://localhost:3003',
    online: false,
    name: null
  };

  it('should set initial state by default', () => {
    const action = { type: 'unknown' };
    const expected = getInitialState();

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it('should handle CHECK_NODE_STATUS_START', () => {
    const appState = {
      list: [nodeA, nodeB]
    };
    const action = { type: ActionTypes.CHECK_NODE_STATUS_START, node: nodeA };
    const expected = {
      list: [
        {
          ...nodeA,
          loading: true
        },
        nodeB
      ]
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it('should handle CHECK_NODE_STATUS_SUCCESS', () => {
    const appState = {
      list: [nodeA, nodeB]
    };
    const action = { type: ActionTypes.CHECK_NODE_STATUS_SUCCESS, node: nodeA, res: {node_name: 'alpha'} };
    const expected = {
      list: [
        {
          ...nodeA,
          online: true,
          name: 'alpha',
          loading: false
        },
        nodeB
      ]
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it('should handle CHECK_NODE_STATUS_FAILURE', () => {
    const appState = {
      list: [
        {
          ...nodeA,
          online: true,
          name: 'alpha',
          loading: false
        },
        nodeB
      ]
    };
    const action = { type: ActionTypes.CHECK_NODE_STATUS_FAILURE, node: nodeA };
    const expected = {
      list: [
        {
          ...nodeA,
          online: false,
          name: 'alpha',
          loading: false
        },
        nodeB
      ]
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it('should handle FETCH_NODE_BLOCKS_START', () => {
    const appState = {
      list: [nodeA, nodeB]
    };
    const action = { type: ActionTypes.FETCH_NODE_BLOCKS_START, node: nodeA };
    const expected = {
      list: [
        {
          ...nodeA,
          loading: true,
          error: null,
        },
        nodeB
      ]
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it('should handle FETCH_NODE_BLOCKS_SUCCESS', () => {
    const appState = {
      list: [nodeA, nodeB]
    };
    const data = [ buildResponseBlock() ];

    const action = { type: ActionTypes.FETCH_NODE_BLOCKS_SUCCESS, node: nodeA, data };
    const expected = {
      list: [
        {
          ...nodeA,
          loading: false,
          blocks: [
            {
              id: data[0].id,
              text: data[0].attributes.data,
            }
          ],
        },
        nodeB
      ]
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it('should handle FETCH_NODE_BLOCKS_SUCCESS', () => {
    const appState = {
      list: [nodeA, nodeB]
    };
    const error = new Error();

    const action = { type: ActionTypes.FETCH_NODE_BLOCKS_FAILURE, node: nodeA, error };
    const expected = {
      list: [
        {
          ...nodeA,
          loading: false,
          error,
        },
        nodeB
      ]
    };

    expect(reducer(appState, action)).toEqual(expected);
  });
});
