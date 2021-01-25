import React from 'react';
import { shallow } from 'enzyme';
import Node from './Node';

describe('components::Node', () => {
  const defaultProps = {
    node: {
      url: 'path/asdasd',
      online: true,
      name: 'Anything',
      loading: false,
      blocks: [
        { id: '1', text: 'Batman' },
        { id: '2', text: 'Superman' },
        { id: '3', text: 'Spider-man' },
      ],
    },
    expanded: true,
    toggleNodeExpanded: Function.prototype,
  }

  it('handles correct number of blocks', () => {
    const tree = shallow(<Node {...defaultProps} />);

    expect(tree.find('[data-qa="blockItem"]')).toHaveLength(defaultProps.node.blocks.length);
  })
})
