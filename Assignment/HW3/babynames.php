<?php
		echo "<table>";
		echo "<tr><th>Name</th><th>Year</th><th>Ranking</th><th>Gender</th></tr>";
		$con = mysqli_connect("localhost", "root", "root", "hw3");
		if($con){
			if(empty($_GET['year']))
				$year='%';
			else
				$year = $_GET['year'];
			if(empty($_GET['gender']))
				$gender='%';
			else
				$gender = $_GET['gender'];	
			
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