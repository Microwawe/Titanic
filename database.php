<?php
	$con = mysqli_connect("31.217.196.244","uogve_v","fa6Xaicu","uogvefke_titanic");

	if (mysqli_connect_errno()) {
	    echo "Failed to connect to MySQL: (" . mysqli_connect_errno() . ") " . mysqli_connect_error();
	}

	mysqli_set_charset($con, "utf8");

