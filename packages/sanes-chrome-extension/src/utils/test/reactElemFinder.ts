import TestUtils from 'react-dom/test-utils';

const MAX_TIMES_EXECUTED = 35;
const INTERVAL = 500;

export const findRenderedDOMComponentWithId = (
  tree: React.Component<any>, // eslint-disable-line
  id: string
): Promise<React.ReactInstance> =>
  new Promise((resolve, reject) => {
    let times = 0;
    const interval = setInterval(() => {
      if (times >= MAX_TIMES_EXECUTED) {
        clearInterval(interval);
        reject(`Unable to find element with id: ${id}.`);
      }

      const elementsWithId = TestUtils.findAllInRenderedTree(
        tree,
        (inst: React.ReactInstance) => {
          return TestUtils.isDOMComponent(inst) && inst.id === id;
        }
      );

      if (elementsWithId.length === 1) {
        clearInterval(interval);
        resolve(elementsWithId[0]);
      }

      times += 1;
    }, INTERVAL);
  });
