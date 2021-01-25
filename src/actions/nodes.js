import fetch from 'cross-fetch';
import * as types from '../constants/actionTypes';

const checkNodeStatusStart = (node) => {
  return {
    type: types.CHECK_NODE_STATUS_START,
    node
  };
};

const checkNodeStatusSuccess = (node, res) => {
  return {
    type: types.CHECK_NODE_STATUS_SUCCESS,
    node,
    res
  };
};

const checkNodeStatusFailure = node => {
  return {
    type: types.CHECK_NODE_STATUS_FAILURE,
    node,
  };
};

export function checkNodeStatus(node) {
  return async (dispatch) => {
    try {
      dispatch(checkNodeStatusStart(node));
      const res = await fetch(`${node.url}/api/v1/status`);

      if(res.status >= 400) {
        dispatch(checkNodeStatusFailure(node));
      }

      const json = await res.json();

      dispatch(checkNodeStatusSuccess(node, json));
      await fetchNodeBlocks(node)(dispatch);
    } catch (err) {
      dispatch(checkNodeStatusFailure(node));
    }
  };
}

export function checkNodeStatuses(list) {
  return (dispatch) => {
    list.forEach(node => {
      dispatch(checkNodeStatus(node));
    });
  };
}

const fetchNodeBlocksStart = node => ({
  type: types.FETCH_NODE_BLOCKS_START,
  node,
});

const fetchNodeBlocksSuccess = (node, data) => ({
  type: types.FETCH_NODE_BLOCKS_SUCCESS,
  node,
  data,
});

const fetchNodeBlocksFailure = (node, error) => ({
  type: types.FETCH_NODE_BLOCKS_FAILURE,
  node,
  error,
});

export function fetchNodeBlocks(node) {
  return async (dispatch) => {
    try {
      dispatch(fetchNodeBlocksStart(node));
      const res = await fetch(`${node.url}/api/v1/blocks`);

      if (res.status >= 400) {
        dispatch(fetchNodeBlocksFailure(node));
      }

      const json = await res.json();

      dispatch(fetchNodeBlocksSuccess(node, json.data || []));
    } catch (err) {
      dispatch(fetchNodeBlocksFailure(node, err));
    }
  };
}
