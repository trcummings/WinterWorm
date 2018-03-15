const allPhrases = [
  'Spinning up Neodynium Ass Crystals...',
  'Eating mad Orc pu$$y...',
  'Perusing vore collection...',
  'Enjoying season 1 of The Big Bang Theory while murdering my family...',
  'Listening to the YouTube anime lo-fi hip hop radio channel...',
  'Wanting to be the little girl...',
  'Constructing additional...HITLERS??...',
  'Dismantling the racism machine...',
  'Gunging enemy team of contestants in slime...',
  'Staring into a mirror stoned and trying not to laugh...',
  'Winning an e-argument about whether or not a certain meme violates the NAP...',
  'Cursing the outgroup...',
  'Dropping fire mixtape...',
  'Thinking about hell...',
  'Gooping on my Grinch...',
  'Greebling a torus...',
  'Doing offensive impressions of the races of Hyrule from The Legend of Zelda...',
  'Hurriedly hiding something under my bed immediately before you come in...',
  'Never trusting anybody, not even myself...',
  'Investigating confusing, but exciting feelings...',
  'Despairing impossibly, & yet, hornily...',
  'Edgeing to 240p hentai, praying there is a titty which is not pixelated...',
  'Yelling at my balls hoping it will make them grow...',
  'Dining upon a flavorful & herbed rotisserie chicken...',
  'Puffing on a big pipe labeled "sativa is for geniuses"...',
];

let phrases = allPhrases.slice();
export const makeLoaderPhrases = () => {
  if (phrases.length === 0) phrases = allPhrases.slice();
  const randomIdx = Math.floor(Math.random() * (phrases.length - 1));
  const randomPhrase = phrases[randomIdx];

  phrases.splice(randomIdx, 1);
  return randomPhrase;
};
