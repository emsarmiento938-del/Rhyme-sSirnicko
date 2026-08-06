-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 06, 2026 at 11:04 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eventtabulationsys`
--

-- --------------------------------------------------------

--
-- Table structure for table `activitylogs`
--

CREATE TABLE `activitylogs` (
  `id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `description` text,
  `ipAddress` varchar(255) DEFAULT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `eventId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `activitylogs`
--

INSERT INTO `activitylogs` (`id`, `action`, `description`, `ipAddress`, `userAgent`, `userId`, `eventId`, `createdAt`, `updatedAt`) VALUES
(1, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2025-12-10 07:20:27', '2025-12-10 07:20:27'),
(2, 'CREATE_EVENT', 'Event created: Miss Teen Bansud  2025', NULL, NULL, 1, 1, '2025-12-10 07:21:38', '2025-12-10 07:21:38'),
(3, 'CREATE_ROUND', 'Round created: production Number', NULL, NULL, 1, 1, '2025-12-10 07:22:35', '2025-12-10 07:22:35'),
(4, 'CREATE_CRITERIA', 'Criteria created: Stage Presence', NULL, NULL, 1, 1, '2025-12-10 07:23:25', '2025-12-10 07:23:25'),
(5, 'CREATE_CRITERIA', 'Criteria created: Awra', NULL, NULL, 1, 1, '2025-12-10 07:23:51', '2025-12-10 07:23:51'),
(6, 'CREATE_CRITERIA', 'Criteria created: Poise and Bearing', NULL, NULL, 1, 1, '2025-12-10 07:24:09', '2025-12-10 07:24:09'),
(7, 'ASSIGN_PARTICIPANT', 'Participant Rhyme Lorenz Espino automatically assigned to round production Number in event Miss Teen Bansud  2025', NULL, NULL, 1, 1, '2025-12-10 07:24:41', '2025-12-10 07:24:41'),
(8, 'CREATE_PARTICIPANT', 'Participant created: Rhyme Lorenz Espino', NULL, NULL, 1, NULL, '2025-12-10 07:24:41', '2025-12-10 07:24:41'),
(9, 'ASSIGN_PARTICIPANT', 'Participant Kate Allyson Agoncillo automatically assigned to round production Number in event Miss Teen Bansud  2025', NULL, NULL, 1, 1, '2025-12-10 07:25:16', '2025-12-10 07:25:16'),
(10, 'CREATE_PARTICIPANT', 'Participant created: Kate Allyson Agoncillo', NULL, NULL, 1, NULL, '2025-12-10 07:25:16', '2025-12-10 07:25:16'),
(11, 'ASSIGN_PARTICIPANT', 'Participant Dea Dela Roca automatically assigned to round production Number in event Miss Teen Bansud  2025', NULL, NULL, 1, 1, '2025-12-10 07:25:55', '2025-12-10 07:25:55'),
(12, 'CREATE_PARTICIPANT', 'Participant created: Dea Dela Roca', NULL, NULL, 1, NULL, '2025-12-10 07:25:55', '2025-12-10 07:25:55'),
(13, 'LOGOUT', 'User logged out', NULL, NULL, 1, NULL, '2025-12-10 07:26:06', '2025-12-10 07:26:06'),
(14, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2025-12-11 02:58:00', '2025-12-11 02:58:00'),
(15, 'ASSIGN_JUDGE', 'Judge Judge One assigned to event Miss Teen Bansud  2025', NULL, NULL, 1, 1, '2025-12-11 02:58:26', '2025-12-11 02:58:26'),
(16, 'ASSIGN_JUDGE', 'Judge Judge Three assigned to event Miss Teen Bansud  2025', NULL, NULL, 1, 1, '2025-12-11 02:58:31', '2025-12-11 02:58:31'),
(17, 'ASSIGN_JUDGE', 'Judge Judge Two assigned to event Miss Teen Bansud  2025', NULL, NULL, 1, 1, '2025-12-11 02:58:34', '2025-12-11 02:58:34'),
(18, 'DELETE_JUDGE', 'Judge deleted: Judge Two', NULL, NULL, 1, NULL, '2025-12-11 02:58:42', '2025-12-11 02:58:42'),
(19, 'DELETE_JUDGE', 'Judge deleted: Judge Three', NULL, NULL, 1, NULL, '2025-12-11 02:58:49', '2025-12-11 02:58:49'),
(20, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-02-04 14:38:55', '2026-02-04 14:38:55'),
(21, 'LOGOUT', 'User logged out', NULL, NULL, 1, NULL, '2026-02-04 14:41:28', '2026-02-04 14:41:28'),
(22, 'LOGIN', 'User Judge One logged in', NULL, NULL, 2, NULL, '2026-02-04 14:41:43', '2026-02-04 14:41:43'),
(23, 'LOGOUT', 'User logged out', NULL, NULL, 2, NULL, '2026-02-04 14:43:11', '2026-02-04 14:43:11'),
(24, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-02-04 14:51:25', '2026-02-04 14:51:25'),
(25, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-04-28 07:41:16', '2026-04-28 07:41:16'),
(26, 'LOGOUT', 'User logged out', NULL, NULL, 1, NULL, '2026-04-28 07:42:17', '2026-04-28 07:42:17'),
(27, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-04-28 07:45:10', '2026-04-28 07:45:10'),
(28, 'LOGIN', 'User Judge One logged in', NULL, NULL, 2, NULL, '2026-04-29 12:49:18', '2026-04-29 12:49:18'),
(29, 'LOGOUT', 'User logged out', NULL, NULL, 2, NULL, '2026-04-29 12:52:38', '2026-04-29 12:52:38'),
(30, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-04-29 12:52:43', '2026-04-29 12:52:43'),
(31, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-08-03 02:43:50', '2026-08-03 02:43:50'),
(32, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-08-03 02:53:20', '2026-08-03 02:53:20'),
(33, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-08-03 02:56:05', '2026-08-03 02:56:05'),
(34, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-08-06 00:55:33', '2026-08-06 00:55:33'),
(35, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-08-06 10:18:41', '2026-08-06 10:18:41'),
(36, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-08-06 10:40:21', '2026-08-06 10:40:21'),
(37, 'LOGOUT', 'User logged out', NULL, NULL, 1, NULL, '2026-08-06 10:42:59', '2026-08-06 10:42:59'),
(38, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-08-06 10:43:09', '2026-08-06 10:43:09'),
(39, 'LOGOUT', 'User logged out', NULL, NULL, 1, NULL, '2026-08-06 10:43:14', '2026-08-06 10:43:14'),
(40, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-08-06 10:45:05', '2026-08-06 10:45:05'),
(41, 'LOGOUT', 'User logged out', NULL, NULL, 1, NULL, '2026-08-06 10:45:10', '2026-08-06 10:45:10'),
(42, 'LOGIN', 'User Judge One logged in', NULL, NULL, 2, NULL, '2026-08-06 10:46:26', '2026-08-06 10:46:26'),
(43, 'LOGOUT', 'User logged out', NULL, NULL, 2, NULL, '2026-08-06 10:46:39', '2026-08-06 10:46:39'),
(44, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-08-06 10:46:43', '2026-08-06 10:46:43'),
(45, 'LOGIN', 'User System Administrator logged in', NULL, NULL, 1, NULL, '2026-08-06 10:51:47', '2026-08-06 10:51:47');

-- --------------------------------------------------------

--
-- Table structure for table `criteria`
--

CREATE TABLE `criteria` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `weight` decimal(5,2) NOT NULL DEFAULT '0.00',
  `maxScore` decimal(5,2) NOT NULL DEFAULT '100.00',
  `roundId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `criteria`
--

INSERT INTO `criteria` (`id`, `name`, `description`, `weight`, `maxScore`, `roundId`, `createdAt`, `updatedAt`) VALUES
(1, 'Stage Presence', 'Confidence', 30.00, 30.00, 1, '2025-12-10 07:23:25', '2025-12-10 07:23:25'),
(2, 'Awra', 'Face Card', 40.00, 40.00, 1, '2025-12-10 07:23:51', '2025-12-10 07:23:51'),
(3, 'Poise and Bearing', 'Standing', 30.00, 30.00, 1, '2025-12-10 07:24:09', '2025-12-10 07:24:09');

-- --------------------------------------------------------

--
-- Table structure for table `eventjudges`
--

CREATE TABLE `eventjudges` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `eventId` int NOT NULL,
  `judgeId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `eventjudges`
--

INSERT INTO `eventjudges` (`createdAt`, `updatedAt`, `eventId`, `judgeId`) VALUES
('2025-12-11 02:58:26', '2025-12-11 02:58:26', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `date` datetime NOT NULL,
  `venue` varchar(255) NOT NULL,
  `status` enum('upcoming','ongoing','completed','archived') DEFAULT 'upcoming',
  `isPublic` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `description`, `date`, `venue`, `status`, `isPublic`, `createdAt`, `updatedAt`) VALUES
(1, 'Miss Teen Bansud  2025', 'young girls ', '2025-12-13 12:30:00', 'Bansud Gymnasium', 'upcoming', 1, '2025-12-10 07:21:38', '2025-12-10 07:21:38');

-- --------------------------------------------------------

--
-- Table structure for table `participantrounds`
--

CREATE TABLE `participantrounds` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `roundId` int NOT NULL,
  `participantId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `participantrounds`
--

INSERT INTO `participantrounds` (`createdAt`, `updatedAt`, `roundId`, `participantId`) VALUES
('2025-12-10 07:24:41', '2025-12-10 07:24:41', 1, 1),
('2025-12-10 07:25:16', '2025-12-10 07:25:16', 1, 2),
('2025-12-10 07:25:55', '2025-12-10 07:25:55', 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `participants`
--

CREATE TABLE `participants` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `participantNumber` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `participants`
--

INSERT INTO `participants` (`id`, `name`, `barangay`, `photo`, `participantNumber`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Rhyme Lorenz Espino', 'Alcadesma', '/uploads/photo-1765351481769-738470454.jpg', '1', 1, '2025-12-10 07:24:41', '2025-12-10 07:24:41'),
(2, 'Kate Allyson Agoncillo', 'Poblacion', '/uploads/photo-1765351516130-380111038.jpg', '2', 1, '2025-12-10 07:25:16', '2025-12-10 07:25:16'),
(3, 'Dea Dela Roca', 'Salcedo', '/uploads/photo-1765351555219-37831644.jpg', '3', 1, '2025-12-10 07:25:55', '2025-12-10 07:25:55');

-- --------------------------------------------------------

--
-- Table structure for table `rounds`
--

CREATE TABLE `rounds` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `order` int DEFAULT '1',
  `status` enum('pending','open','closed') DEFAULT 'pending',
  `eventId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rounds`
--

INSERT INTO `rounds` (`id`, `name`, `description`, `order`, `status`, `eventId`, `createdAt`, `updatedAt`) VALUES
(1, 'production Number', 'Opening Number Introduction', 1, 'open', 1, '2025-12-10 07:22:35', '2025-12-10 07:22:35');

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `id` int NOT NULL,
  `score` decimal(10,2) NOT NULL,
  `weightedScore` decimal(10,2) DEFAULT NULL,
  `isSubmitted` tinyint(1) DEFAULT '0',
  `submittedAt` datetime DEFAULT NULL,
  `participantId` int NOT NULL,
  `criteriaId` int NOT NULL,
  `judgeId` int NOT NULL,
  `roundId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','judge') NOT NULL DEFAULT 'judge',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'System Administrator', 'admin@eventtabulation.com', '$2b$10$U/NcgbudJluUK7qC09k/0OE2S9LLSYDZM/6rnaPFSUBpXzZ858TGK', 'admin', 1, '2025-12-10 07:20:14', '2025-12-10 07:20:14'),
(2, 'Judge One', 'judge1@eventtabulation.com', '$2b$10$6Ldfu/U4d0a.pj7ruysu9.NeHhTQpuftZFzXzKrzN5w0HyIrgOM.G', 'judge', 1, '2025-12-10 07:20:14', '2025-12-10 07:20:14'),
(5, 'Judge Two', 'judge2@eventtabulation.com', '$2b$10$szHKYrXvi2JL4QF9cniSVeNRyZNzlClEdd7epLmJhFsCFm2PE/f7G', 'judge', 1, '2026-08-06 10:45:41', '2026-08-06 10:45:41'),
(6, 'Judge Three', 'judge3@eventtabulation.com', '$2b$10$pSGnFqNd5bBvDy/4pz5DReXbDBo4oKOM3fy01foFNt3tusrElwGqm', 'judge', 1, '2026-08-06 10:45:41', '2026-08-06 10:45:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activitylogs`
--
ALTER TABLE `activitylogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `eventId` (`eventId`);

--
-- Indexes for table `criteria`
--
ALTER TABLE `criteria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roundId` (`roundId`);

--
-- Indexes for table `eventjudges`
--
ALTER TABLE `eventjudges`
  ADD PRIMARY KEY (`eventId`,`judgeId`),
  ADD KEY `judgeId` (`judgeId`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `participantrounds`
--
ALTER TABLE `participantrounds`
  ADD PRIMARY KEY (`roundId`,`participantId`),
  ADD KEY `participantId` (`participantId`);

--
-- Indexes for table `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `participantNumber` (`participantNumber`),
  ADD UNIQUE KEY `participantNumber_2` (`participantNumber`),
  ADD UNIQUE KEY `participantNumber_3` (`participantNumber`),
  ADD UNIQUE KEY `participantNumber_4` (`participantNumber`);

--
-- Indexes for table `rounds`
--
ALTER TABLE `rounds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `eventId` (`eventId`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `participantId` (`participantId`),
  ADD KEY `criteriaId` (`criteriaId`),
  ADD KEY `judgeId` (`judgeId`),
  ADD KEY `roundId` (`roundId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activitylogs`
--
ALTER TABLE `activitylogs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `criteria`
--
ALTER TABLE `criteria`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `participants`
--
ALTER TABLE `participants`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rounds`
--
ALTER TABLE `rounds`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activitylogs`
--
ALTER TABLE `activitylogs`
  ADD CONSTRAINT `activitylogs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `activitylogs_ibfk_2` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `activitylogs_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `activitylogs_ibfk_4` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `activitylogs_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `activitylogs_ibfk_6` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `activitylogs_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `activitylogs_ibfk_8` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `criteria`
--
ALTER TABLE `criteria`
  ADD CONSTRAINT `criteria_ibfk_1` FOREIGN KEY (`roundId`) REFERENCES `rounds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `criteria_ibfk_2` FOREIGN KEY (`roundId`) REFERENCES `rounds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `criteria_ibfk_3` FOREIGN KEY (`roundId`) REFERENCES `rounds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `criteria_ibfk_4` FOREIGN KEY (`roundId`) REFERENCES `rounds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `eventjudges`
--
ALTER TABLE `eventjudges`
  ADD CONSTRAINT `eventjudges_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `eventjudges_ibfk_2` FOREIGN KEY (`judgeId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `participantrounds`
--
ALTER TABLE `participantrounds`
  ADD CONSTRAINT `participantrounds_ibfk_1` FOREIGN KEY (`roundId`) REFERENCES `rounds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `participantrounds_ibfk_2` FOREIGN KEY (`participantId`) REFERENCES `participants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rounds`
--
ALTER TABLE `rounds`
  ADD CONSTRAINT `rounds_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rounds_ibfk_2` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rounds_ibfk_3` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rounds_ibfk_4` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`participantId`) REFERENCES `participants` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_10` FOREIGN KEY (`criteriaId`) REFERENCES `criteria` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_11` FOREIGN KEY (`judgeId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_12` FOREIGN KEY (`roundId`) REFERENCES `rounds` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_13` FOREIGN KEY (`participantId`) REFERENCES `participants` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_14` FOREIGN KEY (`criteriaId`) REFERENCES `criteria` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_15` FOREIGN KEY (`judgeId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_16` FOREIGN KEY (`roundId`) REFERENCES `rounds` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`criteriaId`) REFERENCES `criteria` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_3` FOREIGN KEY (`judgeId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_4` FOREIGN KEY (`roundId`) REFERENCES `rounds` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_5` FOREIGN KEY (`participantId`) REFERENCES `participants` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_6` FOREIGN KEY (`criteriaId`) REFERENCES `criteria` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_7` FOREIGN KEY (`judgeId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_8` FOREIGN KEY (`roundId`) REFERENCES `rounds` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `scores_ibfk_9` FOREIGN KEY (`participantId`) REFERENCES `participants` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
