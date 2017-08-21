<?php
	$con = mysqli_connect("31.217.196.244","micro_titanic_admin","fa6Xaicu","micro_titanic");

	if (mysqli_connect_errno()) {
	    echo "Failed to connect to MySQL: (" . mysqli_connect_errno() . ") " . mysqli_connect_error();
	}

	mysqli_set_charset($con, "utf8");