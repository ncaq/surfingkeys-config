{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    flake-parts.url = "github:hercules-ci/flake-parts";
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs@{
      flake-parts,
      treefmt-nix,
      ...
    }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        treefmt-nix.flakeModule
      ];

      systems = [
        "aarch64-linux"
        "x86_64-linux"
      ];

      perSystem =
        {
          pkgs,
          lib,
          ...
        }:
        let
          inherit (pkgs) nodejs;

          npmRoot = lib.fileset.toSource {
            root = ./.;
            fileset = lib.fileset.unions [
              ./package.json
              ./package-lock.json
            ];
          };
          nodeModules = pkgs.importNpmLock.buildNodeModules {
            inherit
              nodejs
              npmRoot
              ;
          };

          tsSrc = lib.fileset.toSource {
            root = ./.;
            fileset = lib.fileset.unions [
              ./.editorconfig
              ./.gitignore
              ./eslint.config.ts
              ./package.json
              ./tsconfig.json
            ];
          };

          # npm run経由でスクリプト実行を簡単にするためのヘルパー。
          mkNpmCheck =
            name: script:
            pkgs.runCommand name
              {
                nativeBuildInputs = [ nodejs ];
              }
              ''
                cp -r ${tsSrc}/. .
                ln -s ${nodeModules}/node_modules node_modules
                npm run ${script}
                touch $out
              '';
        in
        {
          treefmt.config = {
            projectRootFile = "flake.nix";
            programs = {
              actionlint.enable = true;
              deadnix.enable = true;
              nixfmt.enable = true;
              prettier.enable = true;
              shellcheck.enable = true;
              shfmt.enable = true;
              statix.enable = true;
              typos.enable = true;
              zizmor.enable = true;
            };
            settings.formatter = {
              editorconfig-checker = {
                command = pkgs.editorconfig-checker;
                includes = [ "*" ];
              };
              zizmor.options = [ "--pedantic" ];
            };
          };

          checks = {
            lint-eslint = mkNpmCheck "lint-eslint" "lint:eslint";
            lint-prettier = mkNpmCheck "lint-prettier" "lint:prettier";
            lint-tsc = mkNpmCheck "lint-tsc" "lint:tsc";
          };

          packages = {
            # flake.lockの管理バージョンをre-exportすることで安定した利用を促進。
            inherit (pkgs)
              nix-fast-build
              ;
          };

          devShells.default = pkgs.mkShell {
            buildInputs = with pkgs; [
              # treefmtで指定したプログラムの単体版。
              actionlint
              deadnix
              editorconfig-checker
              nixfmt
              prettier
              shellcheck
              shfmt
              statix
              typos
              zizmor

              # nixの関連ツール。
              nil
              nix-fast-build

              # GitHub関連ツール。
              gh

              # Node.js
              nodejs
            ];
            packages = [ pkgs.importNpmLock.hooks.linkNodeModulesHook ];
            npmDeps = nodeModules;
          };
        };
    };

  nixConfig = {
    extra-substituters = [
      "https://cache.nixos.org/"
      "https://niks3-public.ncaq.net/"
      "https://ncaq.cachix.org/"
      "https://nix-community.cachix.org/"
    ];
    extra-trusted-public-keys = [
      "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
      "niks3-public.ncaq.net-1:e/B9GomqDchMBmx3IW/TMQDF8sjUCQzEofKhpehXl04="
      "ncaq.cachix.org-1:XF346GXI2n77SB5Yzqwhdfo7r0nFcZBaHsiiMOEljiE="
      "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
    ];
  };
}
