<?php
	require 'database.php';

	if(isset($_COOKIE['voted'])) {
	    echo "Olet jo äänestänyt!";
	} else {
		$json_votes = json_decode($_POST['data'], true);
		// äänestettyjen päivien lukumäärä
		$numberOfDates = count($json_votes);	
		$error = false;

		// lisää päivämäärät tietokantaan ja jos päivämäärää on äänestetty aiemmin, sille lisätään yksi ääni
		$date = "";
		for($i = 0; $i<$numberOfDates; $i++) {
			$day = $json_votes[$i]['day'];
			$date = $json_votes[$i]['date'];
			$sql = "INSERT INTO vote (weekday, cruise_date, vote_amount) VALUES ('$day', '$date', '1') ON DUPLICATE KEY UPDATE vote_amount = vote_amount+1";
			if (!mysqli_query($con, $sql)) {
				echo 'Error: ' .mysqli_error($con);
				$error = true;
			}
		}

		//echo $_SERVER['HTTP_X_FORWARDED_FOR'] . " " . $_SERVER['REMOTE_ADDR']
		if (!$error) {
			echo "Äänestäminen onnistui!";
			setcookie("voted", "1494222133059540", time() + 3600 * 24 * 60);
		} else {
			echo "Äänestäminen epäonnistui järjestelmävian takia.";
		}
	}

