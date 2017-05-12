<?php
	require 'database.php';

	// hyttinumerointi, hakee tietokannasta viimeisimmän hytin numeron ja siihen +1, yksinäiset ilmoittautujat menee hyttiin 0
	$sql = "SELECT hytti FROM titanic";
	$result = mysqli_query($con, $sql);

	$hytti = 1;
	if (mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			if ($row['hytti'] > $hytti) {
				$hytti = $row['hytti'];
			}
		}
		$hytti++;
	}

	// lomakkeeseen täytettyjen henkilöiden lukumäärä
	// 2-4 hlö ilmoittautumiset laitetaan automaattisesti samaan hyttiin
	$hlomaara = 0;
	if(isset($_POST['nimi1'])) {
		$nimi1 = mysqli_real_escape_string($con, $_POST['nimi1']);
		$synt_aika1 = mysqli_real_escape_string($con, $_POST['synt_aika1']);
		$sposti1 = mysqli_real_escape_string($con, $_POST['sposti1']);
		$buffet1 = mysqli_real_escape_string($con, $_POST['buffet1']);
		$rastit1 = $_POST['rastikierros1'];
		$hlomaara += 1;
		if(isset($_POST['nimi2'])) {
			$nimi2 = mysqli_real_escape_string($con, $_POST['nimi2']);
			$synt_aika2 = mysqli_real_escape_string($con, $_POST['synt_aika2']);
			$sposti2 = mysqli_real_escape_string($con, $_POST['sposti2']);
			$buffet2 = mysqli_real_escape_string($con, $_POST['buffet2']);
			$rastit2 = $_POST['rastikierros2'];
			$hlomaara += 1;
			if(isset($_POST['nimi3'])) {
				$nimi3 = mysqli_real_escape_string($con, $_POST['nimi3']);
				$synt_aika3 = mysqli_real_escape_string($con, $_POST['synt_aika3']);
				$sposti3 = mysqli_real_escape_string($con, $_POST['sposti3']);
				$buffet3 = mysqli_real_escape_string($con, $_POST['buffet3']);
				$rastit3 = $_POST['rastikierros3'];
				$hlomaara += 1;
				if(isset($_POST['nimi4'])) {
					$nimi4 = mysqli_real_escape_string($con, $_POST['nimi4']);	
					$synt_aika4 = mysqli_real_escape_string($con, $_POST['synt_aika4']);
					$sposti4 = mysqli_real_escape_string($con, $_POST['sposti4']);
					$buffet4 = mysqli_real_escape_string($con, $_POST['buffet4']);
					$rastit4 = $_POST['rastikierros4'];
					$hlomaara += 1;
				}
			}	
		}
		
		// yksittäiset ilmoittautujat laitetaan hyttiin "0", muuten samalla lomakkeella ilmoittautuneet aina samaan hyttiin
		// ja jokainen henkilö tallennetaan omalle rivilleen tietokantaan
		if ($hlomaara == 1) {
			$query = "INSERT INTO titanic (hytti, nimi, synt_aika, sposti, buffet, rastikierros) VALUES ('0', '$nimi1', '$synt_aika1', '$sposti1', '$buffet1', '$rastit1')";
		} else if ($hlomaara == 2) {
			$query = "INSERT INTO titanic (hytti, nimi, synt_aika, sposti, buffet, rastikierros) VALUES ('$hytti', '$nimi1', '$synt_aika1', '$sposti1', '$buffet1', '$rastit1'), ('$hytti', '$nimi2', '$synt_aika2', '$sposti2', '$buffet2', '$rastit2')";
		} else if ($hlomaara == 3) {
			$query = "INSERT INTO titanic (hytti, nimi, synt_aika, sposti, buffet, rastikierros) VALUES ('$hytti', '$nimi1', '$synt_aika1', '$sposti1', '$buffet1', '$rastit1'), ('$hytti', '$nimi2', '$synt_aika2', '$sposti2', '$buffet2', '$rastit2'), ('$hytti', '$nimi3', '$synt_aika3', '$sposti3', '$buffet3', '$rastit3')";
		} else {
			$query = "INSERT INTO titanic (hytti, nimi, synt_aika, sposti, buffet, rastikierros) VALUES ('$hytti', '$nimi1', '$synt_aika1', '$sposti1', '$buffet1', '$rastit1'), ('$hytti', '$nimi2', '$synt_aika2', '$sposti2', '$buffet2', '$rastit2'), ('$hytti', '$nimi3', '$synt_aika3', '$sposti3', '$buffet3', '$rastit3'), ('$hytti', '$nimi4', '$synt_aika4', '$sposti4', '$buffet4', '$rastit4')";
		}


		if (!mysqli_query($con, $query)) {
			echo 'Error: ' .mysqli_error($con);
		} else {
			echo "Ilmoittautuminen onnistui! Saat maksuohjeet sähköpostiisi muutaman päivän sisällä.<br>Hyvää matkaa!";
		}
	}