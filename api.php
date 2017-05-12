<?php
	require 'database.php';

	if($_SERVER['REQUEST_METHOD'] == 'GET') {
		if($_SERVER['PATH_INFO'] == '/prices'){
			$sql = "SELECT * FROM calendar";
			$sql_answer = mysqli_query($con, $sql);
			$result = array();
			while($row = mysqli_fetch_assoc($sql_answer)) {
				$arr = array(
					'date'=> $row['dateID'], 
					'price'=> $row['price'],
					'event'=> $row['event']
				);
				$result[] = $arr;
			}
			echo json_encode($result);
		}
	}