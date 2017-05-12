<?php
	$con = mysqli_connect("mysql.metropolia.fi","mirkon","O1BXHQFfaR7t3ZTH","mirkon");

	if (mysqli_connect_errno()) {
	    echo "Failed to connect to MySQL: (" . mysqli_connect_errno() . ") " . mysqli_connect_error();
	}

	mysqli_set_charset($con, "utf8");


