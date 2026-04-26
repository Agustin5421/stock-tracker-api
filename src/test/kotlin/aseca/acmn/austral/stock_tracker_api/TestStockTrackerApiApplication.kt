package aseca.acmn.austral.stock_tracker_api

import org.springframework.boot.fromApplication
import org.springframework.boot.with


fun main(args: Array<String>) {
	fromApplication<StockTrackerApiApplication>().with(TestcontainersConfiguration::class).run(*args)
}
