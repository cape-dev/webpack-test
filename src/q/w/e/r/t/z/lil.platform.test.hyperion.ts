import * as lodash from 'lodash';
import * as bum from 'baz/bum';

let t = {
    text: "hahahaha"
};

export const test = lodash.get(t, 'text') + bum.miau;