-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 18, 2024 at 08:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `issue_tracker`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_departments`
--

CREATE TABLE `tbl_departments` (
  `id` int(11) NOT NULL,
  `department_name` varchar(50) NOT NULL,
  `current_assigner_id` int(11) NOT NULL,
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_roles`
--

CREATE TABLE `tbl_roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sites`
--

CREATE TABLE `tbl_sites` (
  `id` int(11) NOT NULL,
  `site_name` varchar(50) NOT NULL,
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_tickets`
--

CREATE TABLE `tbl_tickets` (
  `id` int(11) NOT NULL,
  `ticket_id` varchar(50) NOT NULL,
  `associated_site_id` int(11) NOT NULL,
  `ticket_title` varchar(200) NOT NULL,
  `ticket_priority` enum('Low','Medium','High') NOT NULL,
  `raised_by` int(11) NOT NULL,
  `last_assigned_by` int(11) NOT NULL,
  `last_assigned_to` int(11) NOT NULL,
  `ticket_status` enum('Open','In Progress','Closed') NOT NULL DEFAULT 'Open',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_action` enum('New','Renew','Edit Description','Edit Department','Assigned','Reassigned','Resolved','Closed') NOT NULL DEFAULT 'New'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_ticket_attachments`
--

CREATE TABLE `tbl_ticket_attachments` (
  `id` int(11) NOT NULL,
  `ticket_details_id` int(11) NOT NULL,
  `uploaded_file_name` varchar(200) NOT NULL,
  `uploaded_file_type` varchar(25) NOT NULL,
  `uploaded_by` int(11) NOT NULL,
  `uploaded_at` datetime NOT NULL DEFAULT current_timestamp(),
  `uploaded_file_original_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_ticket_details`
--

CREATE TABLE `tbl_ticket_details` (
  `id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `ticket_comment` varchar(3000) NOT NULL,
  `ticket_action` enum('New','Renew','Edit Description','Edit Department','Assigned','Reassigned','Resolved','Closed') NOT NULL,
  `action_description` varchar(500) NOT NULL,
  `action_by` int(11) NOT NULL,
  `action_by_role_id` int(11) NOT NULL,
  `action_by_department_id` int(11) NOT NULL,
  `action_date` datetime NOT NULL DEFAULT current_timestamp(),
  `action_to` int(11) NOT NULL,
  `action_to_role_id` int(11) NOT NULL,
  `action_to_department_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_password` varchar(200) NOT NULL,
  `department_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `can_raise_new_ticket` enum('0','1') NOT NULL DEFAULT '1' COMMENT 'can raise new ticket',
  `can_track_all_tickets` enum('0','1') NOT NULL DEFAULT '0' COMMENT 'can track all tickets of associated sites',
  `can_assign_ticket` enum('0','1') NOT NULL DEFAULT '1' COMMENT 'can assign issue to another of his department',
  `is_admin_user` enum('0','1') NOT NULL DEFAULT '0',
  `is_login` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `user_name`, `user_email`, `user_password`, `department_id`, `role_id`, `can_raise_new_ticket`, `can_track_all_tickets`, `can_assign_ticket`, `is_admin_user`, `is_login`, `created_at`, `is_active`, `is_deleted`) VALUES
(1, 'Admin', 'admin@dril.net.in', '$2b$10$.h3GzwdfQwga6jacs1EzTO5l11uasElTAy/GQrLydFXz87HpwagE6', 0, 0, '0', '1', '0', '1', '0', '2024-09-24 12:33:27', '1', '0');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_site_mapping`
--

CREATE TABLE `tbl_user_site_mapping` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_departments`
--
ALTER TABLE `tbl_departments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `INDEX` (`is_active`) USING BTREE;
ALTER TABLE `tbl_departments` ADD FULLTEXT KEY `FULLTEXT` (`department_name`);

--
-- Indexes for table `tbl_roles`
--
ALTER TABLE `tbl_roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `INDEX` (`is_active`) USING BTREE;
ALTER TABLE `tbl_roles` ADD FULLTEXT KEY `FULLTEXT` (`role_name`);

--
-- Indexes for table `tbl_sites`
--
ALTER TABLE `tbl_sites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `INDEX` (`is_active`) USING BTREE;
ALTER TABLE `tbl_sites` ADD FULLTEXT KEY `FULLTEXT` (`site_name`);

--
-- Indexes for table `tbl_tickets`
--
ALTER TABLE `tbl_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `INDEX` (`raised_by`,`updated_at`) USING BTREE;

--
-- Indexes for table `tbl_ticket_attachments`
--
ALTER TABLE `tbl_ticket_attachments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_ticket_details`
--
ALTER TABLE `tbl_ticket_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `INDEX` (`action_date`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `INDEX` (`is_active`) USING BTREE;
ALTER TABLE `tbl_users` ADD FULLTEXT KEY `FULLTEXT` (`user_name`,`user_email`);

--
-- Indexes for table `tbl_user_site_mapping`
--
ALTER TABLE `tbl_user_site_mapping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_index` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_departments`
--
ALTER TABLE `tbl_departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_roles`
--
ALTER TABLE `tbl_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_sites`
--
ALTER TABLE `tbl_sites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_tickets`
--
ALTER TABLE `tbl_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_ticket_attachments`
--
ALTER TABLE `tbl_ticket_attachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_ticket_details`
--
ALTER TABLE `tbl_ticket_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tbl_user_site_mapping`
--
ALTER TABLE `tbl_user_site_mapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
