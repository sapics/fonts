@echo off

cd %cd%
cd ..

for /f "usebackq" %%i in (`dir /B /S *.ttf`) do (
	echo %%i
	bat\sfnt2woff-zopfli.exe %%i
	bat\woff2_compress.exe %%i
)

cd %cd%
