
Module.setPlayerModels = function() {
  BananaBread.setPlayerModelInfo("snoutx10k", "snoutx10k", "snoutx10k", "snoutx10k/hudguns", 0, 0, 0, 0, 0, "snoutx10k", "snoutx10k", "snoutx10k", true);
};

Module.tweakDetail = function() {
  BananaBread.execute('fog 10000'); // disable fog
  BananaBread.execute('maxdebris 10');
  BananaBread.execute('glare 1');
  BananaBread.execute('glarescale 1.75');
  BananaBread.execute('blurglare 7');
  BananaBread.execute('waterreflect 1');
  BananaBread.execute('waterrefract 1');
};

Module.loadDefaultMap = function() {
  BananaBread.execute('sleep 10 [ effic mo ]');
};

Module.autoexec = function() {
  if(true === Module['join']) {
    console.log('connecting to host');
    BananaBread.execute('connect');
  }
};