<?php include 'database.php' ?>
<html>
    <head>
        <title>Messeges</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
   <style>
	
	#container{
			background-color:#463E3E;
			width:500px;
			padding:20px ;
			overflow:auto;
			min-heigt:550px;
			height:620px;
	}
	#messeges{
			background-color:white;
			width:98%;
			margin:22px auto;
			height:400px;
			overflow:auto;
	}
	.messege{
			list-style:none;
			padding:8px;
			border-bottom:1px #cccccc dotted;
	}
	.messege span{
			color:#aaaaaa
	}
	#input{
		width:90%
		min-height:90px;
		margin:auto;
		padding:0;
	}
	#input input[type='text']{
			height: 28px;
			width:48%;
			padding:3px;
			margin-left:5px;
			margin-bottom:20px;
			border:#666666 soild 1px;
	}
	#input .messege-btn{
		padding:5px;
		margin-bottom:30px;
		width:100%;
		margin:10px auto;
		
	}
	
@media only screen and (max-width:768px){
	#input input[type='text']{
		width:98%;
	}
		
}
	</style>
<script src="https://www.gstatic.com/firebasejs/3.6.4/firebase.js"></script>
<link rel="stylesheet" href="_js/jquery-ui-1.12.1.custom/jquery-ui.css">

<body>
	<div id='container'>
		<header>
			<h1>Messeges Box</h1>
		</header>
		<div id='messeges'>
			<ul>
				<li class='messege'><span>11:11 - </span>Gabriel: </li>
				<li class='messege'><span>11:11 - </span>Gabriel: </li>
				<li class='messege'><span>11:11 - </span>Gabriel: </li>
			</ul>
		</div>
		<div id="input">
			<form method='post' action='procces.php'>
				<input type=text name="user" placeholder='Enter Name'>
				<input type=text name="messege" placeholder='Messege'>
				<br>
				<input type="submit" name="submit" value='send messege' class='messege-btn'>
			
			</form>