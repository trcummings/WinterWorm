import loaders from './loaders';
import meta from './meta';
import input from './input';
import ticker from './ticker';
import inputControl from './inputControl';
import physics from './physics';

const coreSystems = [
  loaders,
  input,
  ticker,
  inputControl,
  meta,
  physics,
];

export default coreSystems;
