package aseca.acmn.austral.stock_tracker_api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class StockTrackerApiApplication

fun main(args: Array<String>) {
	runApplication<StockTrackerApiApplication>(*args)
}
