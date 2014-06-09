var readline = require('readline');

var cin = process.stdin;
cin.setEncoding('utf8');

var rl = readline.createInterface(cin, process.stdout,completer);

rl.setPrompt('git-sh> ');
rl.prompt();

var cmd={'log':'git log'}

rl.on('line', function(line) {

	if(cmd[line] != undefined){
		b();
	}
	rl.prompt();

}).on('SIGINT', function() {
	console.log('^C');
	rl.write('\n');

}).on('close', function() {
	process.exit(0);
})


function completer(line) {
	var completions = ['help','error','exit','quit'];
	var hits = completions.filter(function(c) { 
		return c.indexOf(line) == 0; 
	});
	return [hits.length ? hits : completions, line]
}

function exe(cmd, args, callBack ) {
	var spawn = require('child_process').spawn;
	var child = spawn(cmd, args);
	var resp = "";

	child.stdout.on('data', function (buffer) { resp += buffer.toString() });
	child.stdout.on('end', function() { callBack (resp) });
}

function run_cmd(line){
	exe( "ls", ["-l"], function(text) { console.log (text) });
}

function a(){
	var exec = require('child_process').exec,
	    child;

	child = exec('cat *.js bad_file | wc -l',
			function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});

	child.stdin.end();
}

function aa(){
	var spawn = require('child_process').spawn,
	    ls    = spawn('ls', ['-lh', '/usr']);
	console.log('fin');

	ls.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});

	ls.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	ls.on('close', function (code) {
		console.log('child process exited with code ' + code);

	});
}



function aaa(){

	var spawn = require('child_process').spawn,
	    grep  = spawn('ls', ['-ltr']);
	grep.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
		grep.stdin.end();

	});


}


function b(){
	var exec = require('child_process').exec,
	    child;

	child = exec('ls -ltr',
			function (error, stdout, stderr) {
				console.log('\n\n'+stdout);
				rl.write('\n');

			});
}
