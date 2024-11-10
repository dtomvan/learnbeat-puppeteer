{ pkgs ? import <nixpkgs> {}, ... }: pkgs.mkShell {
	buildInputs = with pkgs; [
	nodejs_20
	pnpm
	chromium
	];
	PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = "1";
	PUPPETEER_EXECUTABLE_PATH = "${pkgs.chromium.outPath}/bin/chromium";
	shellHook = ''
	test -d node_modules || pnpm i
	pnpm run start
	'';
}
