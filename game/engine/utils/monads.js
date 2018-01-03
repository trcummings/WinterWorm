import R from 'ramda';

const asArray = x => (Array.isArray(x) ? x : Array.of(x));

export const View = R.pipe(
  x => R.compose(asArray, x),
  computation => ({
    computation, // Need this later on.
    fold: props => computation(props),

    // Since the computation results in an array, we can map it with `f`.
    map: f => View(x => computation(x).map(f)),

    // Contramap is invoked on input props (not results),
    // so we don't have to change anything.
    contramap: g => View(x => computation(g(x))),

    // Now our `concat` is just array concat. Simple!
    concat: other =>
      View(props => computation(props).concat(other.computation(props))),
  })
);

export const Reader = computation => ({
  runReader: ctx => computation(ctx),

  map: f => Reader(ctx => f(computation(ctx))),

  chain: f => Reader(ctx =>
    // Get the result from original computation
    // Now get the result from the computation
    // inside the Reader `f(computation(ctx))`.
    f(computation(ctx)).runReader(ctx)
  ),
  ask: () => Reader(x => x),
});

export const Monad = {
  do: (gen) => {
    let g = gen(); // Will need to re-bind generator when done.
    const step = (value) => {
      const result = g.next(value);
      if (result.done) {
        g = gen();
        return result.value;
      }
      return result.value.chain(step);
    };
    return step();
  },
};

// // e.g.
// const b = Monad.do(function* () {
//   const ctx = yield Reader.ask(); // This will chain!
//
//   // Now this is just "normal" JS
//   const x = ctx + 1;
//   const y = x * 2;
//   const z = `Got ${y}!`;
//
//   // Return the final value in the chain
//   return Reader.of(z);
// });
//
// b.runReader(1); // 'Got 4!'
// b.runReader(0); // 'Got 2!'
// b.runReader(-1); // 'Got 0!'
