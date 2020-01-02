<!DOCTYPE html>
<html>
<head>
	<title>Babynames</title>
	<style type="text/css">
		table, th, td {
  			border: 1px solid black;
		}
	</style>
</head>
<body>
	<form action="babynames.php" method="POST">
	<label for="years">Year:</label>
	<select name="year" id="years">
		<option value="%">All years</option>
		<option value="2011">2011</option>
		<option value="2012">2012</option>
		<option value="2013">2013</option>
		<option value="2014">2014</option>
		<option value="2015">2015</option>
	</select>

	<label for="genders">Gender:</label>
	<select name="gender" id="genders">
		<option value="%">Both</option>
		<option value="M">male</option>
		<option value="F">female</option>
	</select>

	<input type="submit" name="submit"/>
	</form>
	<br/>
	<br/>
	<?php
		echo "<table>";
		echo "<tr><th>Name</th><th>Year</th><th>Ranking</th><th>Gender</th></tr>";
		$con = mysqli_connect("localhost:3306", "root", "root", "hw3");
		if($con){
			if(empty($_POST['year']))
				$year='%';
			else
				$year = $_POST['year'];
			if(empty($_POST['gender']))
				$gender='%';
			else
				$gender = $_POST['gender'];	
			
			$sql = "select name, year, ranking, gender from babynames where year like '$year' and gender like '$gender' order by year, gender, ranking";
		
			$result = mysqli_query($con, $sql);
			if(mysqli_num_rows($result)!=0){
				while($row = mysqli_fetch_array($result)){
					echo "<tr><td>",$row['name'],"</td><td>",$row['year'],"</td><td>",$row['ranking'],"</td><td>",$row['gender'],"</td></tr>";					
				}
			}
		}
		else{
			echo "Unable to connect to db".mysqli_connect_errno();
		}
		mysqli_close($con);
		echo "</table>";
	?>
</body>
</html>