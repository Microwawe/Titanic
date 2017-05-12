<?php
	require 'database.php';

	$sql = "SELECT weekday, cruise_date, vote_amount FROM vote ORDER BY vote_amount DESC";
	
	$results = mysqli_query($con, $sql);

	$result = array();
	while($row = mysqli_fetch_assoc($results)) {
		$arr = array(
			'votes'=> $row['vote_amount'], 
			'day'=> $row['weekday'],
			'date'=> $row['cruise_date']
		);
		$result[] = $arr;
	}
	
	echo json_encode($result);