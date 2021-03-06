import Ember from 'ember';

const {
  Helper,
  computed: { filter, filterBy },
  defineProperty,
  get,
  isArray,
  isEmpty,
  isPresent,
  observer,
  set
} = Ember;

export default Helper.extend({
  compute([array, byPath, value]) {
    set(this, 'array', array);
    set(this, 'byPath', byPath);
    set(this, 'value', value);

    return get(this, 'content');
  },

  array: null,
  byPath: null,
  value: null,
  content: null,

  byPathDidChange: observer('byPath', 'value', function() {
    let byPath = get(this, 'byPath');
    let value = get(this, 'value');

    if (isEmpty(byPath)) {
      defineProperty(this, 'content', []);
      return;
    }

    let filterFn;

    if (value) {
      if (typeof value === 'function') {
        filterFn = (item) => value(get(item, byPath));
      } else {
        filterFn = (item) => get(item, byPath) === value;
      }
    } else {
      filterFn = (item) => isPresent(get(item, byPath));
    }

    let cp = filter(`array.@each.${byPath}`, filterFn);

    defineProperty(this, 'content', cp);
  }),

  contentDidChange: observer('content', function() {
    this.recompute();
  })
});
