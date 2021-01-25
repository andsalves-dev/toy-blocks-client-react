import * as ActionTypes from '../constants/actionTypes';
import initialState from './initialState';

export default function nodesReducer(state = initialState().nodes, action) {
  let list, nodeIndex;
  switch (action.type) {
    case ActionTypes.CHECK_NODE_STATUS_START:
      list = state.list;
      nodeIndex = state.list.findIndex(p => p.url === action.node.url);
      if (nodeIndex >= 0) {
        list = [
          ...state.list.slice(0, nodeIndex),
          {
            ...state.list[nodeIndex],
            loading: true
          },
          ...state.list.slice(nodeIndex + 1)
        ];
      }
      return {
        ...state,
        list
      };
    case ActionTypes.CHECK_NODE_STATUS_SUCCESS:
      list = state.list;
      nodeIndex = state.list.findIndex(p => p.url === action.node.url);
      if (nodeIndex >= 0) {
        list = [
          ...state.list.slice(0, nodeIndex),
          {
            ...state.list[nodeIndex],
            online: true,
            name: action.res.node_name,
            loading: false
          },
          ...state.list.slice(nodeIndex + 1)
        ];
      }
      return {
        ...state,
        list
      };
    case ActionTypes.CHECK_NODE_STATUS_FAILURE:
      list = state.list;
      nodeIndex = state.list.findIndex(p => p.url === action.node.url);
      if (nodeIndex >= 0) {
        list = [
          ...state.list.slice(0, nodeIndex),
          {
            ...state.list[nodeIndex],
            online: false,
            loading: false
          },
          ...state.list.slice(nodeIndex + 1)
        ];
      }
      return {
        ...state,
        list
      };
    case ActionTypes.FETCH_NODE_BLOCKS_START: {
      const newList = state.list.map(node => {
        if (node.url === action.node.url) {
          return {
            ...node,
            loading: true,
            error: null,
          }
        }

        return node;
      });

      return {
        ...state,
        list: newList,
      }
    }
    case ActionTypes.FETCH_NODE_BLOCKS_SUCCESS: {
      const newList = state.list.map(node => {
        if (node.url === action.node.url) {
          return {
            ...node,
            loading: false,
            blocks: action.data ? action.data.map(item => ({
              id: item.id,
              text: item.attributes ? item.attributes.data : '',
            })) : []
          }
        }

        return node;
      });

      return {
        ...state,
        list: newList,
      }
    }
    case ActionTypes.FETCH_NODE_BLOCKS_FAILURE: {
      const newList = state.list.map(node => {
        if (node.url === action.node.url) {
          return {
            ...node,
            loading: false,
            error: action.error,
          }
        }

        return node;
      });

      return {
        ...state,
        list: newList,
      }
    }
    default:
      return state;
  }
}
