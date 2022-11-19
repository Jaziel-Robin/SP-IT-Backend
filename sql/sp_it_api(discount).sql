CREATE TABLE `discount` (
  `discountid` int NOT NULL AUTO_INCREMENT,
  `discount_start_date` date NOT NULL,
  `discount_end_date` date NOT NULL,
  `discount` double NOT NULL,
  `fk_productid` int NOT NULL,
  PRIMARY KEY (`discountid`),
  KEY `fk_productid_idx` (`fk_productid`),
  CONSTRAINT `fk_productid` FOREIGN KEY (`fk_productid`) REFERENCES `product` (`productid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci