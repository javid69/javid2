{ pkgs }:
pkgs.mkShell {
  packages = with pkgs; [
    nodejs_20
    nodePackages.pnpm
    libvips
    pkg-config
    python3
    gnumake
  ];
  shellHook = ''
    export PATH=$PWD/node_modules/.bin:$PATH
  '';
}
