-- MySQL dump 10.13  Distrib 8.0.17, for Linux (x86_64)
--
-- Host: localhost    Database: testapp
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `control_center_attributes`
--

DROP TABLE IF EXISTS `control_center_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `control_center_attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `value` varchar(600) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `control_center_attributes`
--

LOCK TABLES `control_center_attributes` WRITE;
/*!40000 ALTER TABLE `control_center_attributes` DISABLE KEYS */;
INSERT INTO `control_center_attributes` VALUES (1,'Last_upgrade_time','Monday 01 August 2022 11:15:41 AM IST'),(2,'Elasticsearch Port','888'),(3,'labels','[heartbeat,Telegraf heartbeat,Telegraf SNMP,vuNodeDCMCelery,vuNodeDiscoveryCelery,vuNodeAlert,vuNodeSNMP,vuNodeSNMPCelery,vuNodeDCM,vuNodeDiscovery,vuNodeDataCollector,vuNodeDAO,redis,geoserver,telegrafTrap,telegrafSyslog,telegrafTelemetry,goFlow,vunode,vunetstrem,vuInterface,telegraf ]'),(4,'platform_version','2.0'),(5,'cc_version','2.0');
/*!40000 ALTER TABLE `control_center_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deployment_type`
--

DROP TABLE IF EXISTS `deployment_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deployment_type` (
  `type` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deployment_type`
--

LOCK TABLES `deployment_type` WRITE;
/*!40000 ALTER TABLE `deployment_type` DISABLE KEYS */;
INSERT INTO `deployment_type` VALUES ('Free Scale','Can run N instances on M Nodes(No Limitations)'),('Restricted Scale','Can run 1 instance each per port per node on M nodes'),('Standalone','Can run only 1 instance(at System Level)'),('Stateful','1 instance per node on M nodes');
/*!40000 ALTER TABLE `deployment_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hosts`
--

DROP TABLE IF EXISTS `hosts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hosts` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `ip_address` varchar(32) DEFAULT NULL,
  `host_type` varchar(20) DEFAULT NULL,
  `labels` json DEFAULT NULL,
  `details` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hosts`
--

LOCK TABLES `hosts` WRITE;
/*!40000 ALTER TABLE `hosts` DISABLE KEYS */;
INSERT INTO `hosts` VALUES (1,'sakthi-laptop','host on current machine','127.0.0.1','App','[\"goflow\", \"heartbeat\", \"telegraf\", \"vuInterface\", \"vunetstrem\", \"vunode\", \"vuNodeSNMPCelery\", \"redis\", \"geoserver\"]','{\"OS\": \"Linux\", \"memory\": \"15.4 GiB\", \"total_storage\": \"511 GiB\", \"processor_type\": \"Intel Core\", \"storage_mounts\": [{\"Storage\": \"23 mb\", \"Mount_point\": \"/etc/fstab\"}], \"number_of_cores\": 4}'),(12,'sakthi-vm','1','1','App','[\"vuNodeDataCollector\", \"Telegraf heartbeat\", \"vuNodeDiscoveryCelery\", \"geoserver\", \"vuNodeDCM\", \"heartbeat\"]','{\"OS\": \"1\", \"memory\": \"1\", \"total_storage\": \"1\", \"processor_type\": \"1\", \"storage_mounts\": {\"Storage\": \"1\", \"Mount_point\": \"1\"}, \"number_of_cores\": \"1\"}');
/*!40000 ALTER TABLE `hosts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(150) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `type` varchar(30) DEFAULT NULL,
  `labels` json DEFAULT NULL,
  `host_assignment_type` varchar(30) DEFAULT NULL,
  `expected_instances` int(11) DEFAULT NULL,
  `stack_file_name` varchar(50) DEFAULT NULL,
  `deployment_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `deployment_type` (`deployment_type`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`deployment_type`) REFERENCES `deployment_type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'elasticsearch','1 instance per node on M nodes','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'2_elasticsearch','Stateful'),(2,'broker','1 instance per node on M nodes','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'3_kafka-zookeeper','Stateful'),(3,'connect','Can run 1 instance each per port per node on M nodes','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'kafka-connect','Restricted Scale'),(4,'geoserver','1 instance at System level','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'geoserver','Standalone'),(5,'goflow','Can run 1 instance each per port per node on M nodes','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'goflow','Restricted Scale'),(6,'heartbeat','Can run N instances on M Nodes(No Limitations)','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'heartbeat-1-1-1','Free Scale'),(7,'logstash','Can run N instances on M Nodes(No Limitations)','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'logstash-1','Free Scale'),(8,'mysql','1 instance per node on M nodes','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'1_mysql','Stateful'),(9,'route','Can run only 1 instance (at system level)','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'4_redis','Standalone'),(10,'telegraf','Can run N instances on M nodes. (no limitations)','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'telegraf','Free Scale'),(11,'telegraf-heartbeat','Can run N instances on M nodes. (no limitations)','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'telegraf-heartbeat-1-1-1','Free Scale'),(12,'telegraf-snmp','Can run N instances on M nodes. (no limitations)','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'telegraf-snmp-1-1-1','Free Scale'),(13,'timescaledb','1 instance per node on M nodes ','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'timescaledb','Stateful'),(14,'vuinterface','Can run 1 instance on M nodes(once Traefik is available N instances on M nodes) ','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'vuinterface','Restricted Scale'),(15,'vunode','Can run only 1 instance (at system level)','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'vunode','Standalone'),(16,'zookeeper','1 instance per node on M nodes ','enabled','DB','[\"node.hostname == sakthi-laptop\"]','label-based',1,'3_kafka-zookeeper','Stateful');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `typemapping`
--

DROP TABLE IF EXISTS `typemapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `typemapping` (
  `serviceName` varchar(50) NOT NULL,
  `type` varchar(20) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`serviceName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `typemapping`
--

LOCK TABLES `typemapping` WRITE;
/*!40000 ALTER TABLE `typemapping` DISABLE KEYS */;
INSERT INTO `typemapping` VALUES ('broker','Stateful','1 instance per node on M nodes'),('connect','Restricted Scale','Can run 1 instance each per port per node on M nodes'),('elasticsearch','Stateful','1 instance per node on M nodes'),('geoserver','Standalone','1 instance at System level'),('GoFlow','Restricted Scale','Can run 1 instance each per port per node on M nodes'),('Heartbeat','Free Scale','Can run N instances on M Nodes(No Limitations)'),('mysql','Stateful','1 instance per node on M nodes'),('redis','Standalone','1 instance at System level'),('TelegrafHeartbeat','Free Scale','Can run N instances on M Nodes(No Limitations)'),('telegrafSNMP','Free Scale','Can run N instances on M Nodes(No Limitations)'),('telegrafSNMPHeartbeat','Free Scale','Can run N instances on M Nodes(No Limitations)'),('telegrafSysLog','Restricted Scale','Can run 1 instance each per port per node on M nodes'),('telegrafTelemetry','Restricted Scale','Can run 1 instance each per port per node on M nodes'),('telegrafTrap','Restricted Scale','Can run 1 instance each per port per node on M nodes'),('vuInterface','Restricted Scale','Can run 1 instance on M nodes(once Traefik is available N instances on M nodes)'),('vuNode Alert','Free Scale','Can run N instances on M Nodes(No Limitations)'),('vuNodeDAO','Standalone','Can run only 1 instance(at System Level)'),('vuNodeDataCollector','Standalone','Can run only 1 instance(at System Level)'),('vuNodeDCM','Standalone','Can run only 1 instance(at System Level)'),('vuNodeDCMCelery','Free Scale','Can run N instances on M Nodes(No Limitations)'),('vuNodeDiscovery','Standalone','Can run only 1 instance(at System Level)'),('vuNodeDiscoveryCelery','Free Scale','Can run N instances on M Nodes(No Limitations)'),('vuNodeEmailCelery','Free Scale','Can run N instances on M Nodes(No Limitations)'),('vuNodeSNMP','Free Scale','Can run N instances on M Nodes(No Limitations)'),('vuNodeSNMPCelery','Free Scale','Can run N instances on M Nodes(No Limitations)'),('zookeeper','Stateful','1 instance per node on M nodes');
/*!40000 ALTER TABLE `typemapping` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-05  7:05:12
