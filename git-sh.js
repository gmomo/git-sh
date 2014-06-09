#!/usr/bin/env node

var readline = require('readline');
var exec = require('child_process').exec;
var child_process = require('child_process');
var fs = require('fs');

var CMD_SH;
var KEYS;
var PROMPT='git-sh> ';
var FILE = __dirname + '/cmd.json';
var UTF8 = 'utf8';

var rl;

/*
 * MAIN
 */

main();

/*
 * FUNCTION
 */

function main(){

	fs.readFile(FILE, UTF8, function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		} 
		CMD_SH = JSON.parse(data);
		KEYS=Object.keys(CMD_SH)    
	});

	var cin = process.stdin;
	cin.setEncoding(UTF8);

	rl = readline.createInterface(cin, process.stdout,completer);
	rl.setPrompt(PROMPT);
	rl.prompt();

	rl.on('line', function(line) {

		if(line == 'man'){
			console.log('\nAlias \t Comando');
			console.log('===================');
			for(var k in CMD_SH){		
				console.log(k);
				console.log('\t'+CMD_SH[k]+'\n');
			}		
		}else{
			var cmd = line.split(' ')[0];
			var arg = line.substring(cmd.length,line.length)
			if(CMD_SH[cmd] != undefined){
				run_cmd(CMD_SH[cmd],arg);
			}
		}

		rl.prompt();

	}).on('SIGINT', function() {
		rl.write('^C');	
		rl.write('\n');

	}).on('close', function() {
		console.log('');
		process.exit(0);
	})
}

function completer(line) {
	var hits = KEYS.filter(function(c) { 
		return c.indexOf(line) == 0; 
	});
	return [hits.length ? hits : KEYS, line]
}

function run_cmd(cmd,arg){
	
	var child = exec(cmd+arg,
			function (error, stdout, stderr) {		
				var msg;
	
				if(stdout != ''){
					msg=stdout;
				}else if (stderr != ''){
					msg=stderr;
				}
				
				if(msg != null){
					rl.setPrompt('');
					rl.write('\n');				
					console.log(msg);
					rl.setPrompt(PROMPT);
					rl.write('\n');
				}
			});	
}

function execSync(command) {
	// Run the command in a subshell
	child_process.exec(command + ' 2>&1 1>output && echo done! > done');
	 
	// Block the event loop until the command has executed.
	while (!fs.existsSync('done')) {
	// Do nothing
	}
	 
	// Read the output
	var output = fs.readFileSync('output',UTF8);
	 
	// Delete temporary files.
	fs.unlinkSync('output');
	fs.unlinkSync('done');
	 
	return output;
}





