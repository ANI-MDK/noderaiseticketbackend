-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 16, 2023 at 10:53 AM
-- Server version: 5.7.23-23
-- PHP Version: 8.1.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ropewy6y_dril_onm`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_cabin_grip_hangers_form_values`
--

CREATE TABLE `tbl_cabin_grip_hangers_form_values` (
  `id` int(11) NOT NULL,
  `internal_form_id` varchar(100) NOT NULL,
  `cabin_body` varchar(25) NOT NULL,
  `cabin_body_remarks` varchar(300) NOT NULL,
  `door` varchar(25) NOT NULL,
  `door_remarks` varchar(300) NOT NULL,
  `seat` varchar(25) NOT NULL,
  `seat_remarks` varchar(300) NOT NULL,
  `grip` varchar(25) NOT NULL,
  `grip_remarks` varchar(300) NOT NULL,
  `jaws` varchar(25) NOT NULL,
  `jaws_remarks` varchar(300) NOT NULL,
  `spider` varchar(25) NOT NULL,
  `spider_remarks` varchar(300) NOT NULL,
  `hanger` varchar(25) NOT NULL,
  `hanger_remarks` varchar(300) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_dg_maintenance_form_values`
--

CREATE TABLE `tbl_dg_maintenance_form_values` (
  `id` int(11) NOT NULL,
  `internal_form_id` varchar(100) NOT NULL,
  `radiator_water_level` varchar(50) NOT NULL,
  `radiator_water_level_emergency` varchar(50) NOT NULL,
  `radiator_water_level_remarks` varchar(300) NOT NULL,
  `radiator_water_level_remarks_emergency` varchar(300) NOT NULL,
  `engine_oil_level` varchar(50) NOT NULL,
  `engine_oil_level_emergency` varchar(50) NOT NULL,
  `engine_oil_level_remarks` varchar(300) NOT NULL,
  `engine_oil_level_remarks_emergency` varchar(300) NOT NULL,
  `turbo_generator_oil_level` varchar(50) NOT NULL,
  `turbo_generator_oil_level_emergency` varchar(50) NOT NULL,
  `turbo_generator_oil_level_remarks` varchar(300) NOT NULL,
  `turbo_generator_oil_level_remarks_emergency` varchar(300) NOT NULL,
  `battery_distilled_water_level` varchar(50) NOT NULL,
  `battery_distilled_water_level_emergency` varchar(50) NOT NULL,
  `battery_distilled_water_level_remarks` varchar(300) NOT NULL,
  `battery_distilled_water_level_remarks_emergency` varchar(300) NOT NULL,
  `battery_terminal_condition` varchar(50) NOT NULL,
  `battery_terminal_condition_emergency` varchar(50) NOT NULL,
  `battery_terminal_condition_remarks` varchar(300) NOT NULL,
  `battery_terminal_condition_remarks_emergency` varchar(300) NOT NULL,
  `v_belt_condition` varchar(50) NOT NULL,
  `v_belt_condition_emergency` varchar(50) NOT NULL,
  `v_belt_condition_remarks` varchar(300) NOT NULL,
  `v_belt_condition_remarks_emergency` varchar(300) NOT NULL,
  `abnormal_sound` varchar(50) NOT NULL,
  `abnormal_sound_emergency` varchar(50) NOT NULL,
  `abnormal_sound_remarks` varchar(300) NOT NULL,
  `abnormal_sound_remarks_emergency` varchar(300) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_earth_pit_measurement_form_values`
--

CREATE TABLE `tbl_earth_pit_measurement_form_values` (
  `id` int(11) NOT NULL,
  `internal_form_id` varchar(100) NOT NULL,
  `earth_pit_number` varchar(10) NOT NULL,
  `earth_pit_description` varchar(100) NOT NULL,
  `present_earthing_value_ohm` decimal(6,2) NOT NULL,
  `remarks` varchar(300) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_electrical_maintenance_form_values`
--

CREATE TABLE `tbl_electrical_maintenance_form_values` (
  `id` int(11) NOT NULL,
  `internal_form_id` varchar(100) NOT NULL,
  `main_drive` varchar(50) NOT NULL,
  `main_drive_remarks` varchar(300) NOT NULL,
  `control_desk` varchar(50) NOT NULL,
  `control_desk_remarks` varchar(300) NOT NULL,
  `plc` varchar(50) NOT NULL,
  `plc_remarks` varchar(300) NOT NULL,
  `switch_gear` varchar(50) NOT NULL,
  `switch_gear_remarks` varchar(300) NOT NULL,
  `emergency_push_buttons` varchar(50) NOT NULL,
  `emergency_push_buttons_remarks` varchar(300) NOT NULL,
  `lighting` varchar(50) NOT NULL,
  `lighting_remarks` varchar(300) NOT NULL,
  `lift` varchar(50) NOT NULL,
  `lift_remarks` varchar(300) NOT NULL,
  `isolator` varchar(50) NOT NULL,
  `isolator_remarks` varchar(300) NOT NULL,
  `pcc` varchar(50) NOT NULL,
  `pcc_remarks` varchar(300) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_hydraulic_system_logsheet_form_values`
--

CREATE TABLE `tbl_hydraulic_system_logsheet_form_values` (
  `id` int(11) NOT NULL,
  `internal_form_id` varchar(100) NOT NULL,
  `tightened_motor_cylinder` tinyint(4) NOT NULL,
  `repaired_motor_cylinder` tinyint(4) NOT NULL,
  `replaced_motor_cylinder` tinyint(4) NOT NULL,
  `lubricated_motor_cylinder` tinyint(4) NOT NULL,
  `motor_cylinder_remarks` varchar(300) NOT NULL,
  `tightened_oil_pressure` tinyint(4) NOT NULL,
  `repaired_oil_pressure` tinyint(4) NOT NULL,
  `replaced_oil_pressure` tinyint(4) NOT NULL,
  `lubricated_oil_pressure` tinyint(4) NOT NULL,
  `oil_pressure_remarks` varchar(300) NOT NULL,
  `tightened_oil_level` tinyint(4) NOT NULL,
  `repaired_oil_level` tinyint(4) NOT NULL,
  `replaced_oil_level` tinyint(4) NOT NULL,
  `lubricated_oil_level` tinyint(4) NOT NULL,
  `oil_level_remarks` varchar(300) NOT NULL,
  `tightened_oil_temp` tinyint(4) NOT NULL,
  `repaired_oil_temp` tinyint(4) NOT NULL,
  `replaced_oil_temp` tinyint(4) NOT NULL,
  `lubricated_oil_temp` tinyint(4) NOT NULL,
  `oil_temp_remarks` varchar(300) NOT NULL,
  `tightened_oil_leakage` tinyint(4) NOT NULL,
  `repaired_oil_leakage` tinyint(4) NOT NULL,
  `replaced_oil_leakage` tinyint(4) NOT NULL,
  `lubricated_oil_leakage` tinyint(4) NOT NULL,
  `oil_leakage_remarks` varchar(300) NOT NULL,
  `tightened_n2_cylinder` tinyint(4) NOT NULL,
  `repaired_n2_cylinder` tinyint(4) NOT NULL,
  `replaced_n2_cylinder` tinyint(4) NOT NULL,
  `lubricated_n2_cylinder` tinyint(4) NOT NULL,
  `n2_cylinder_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_6am` smallint(6) NOT NULL,
  `hydraulic_pressure_6am_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_7am` smallint(6) NOT NULL,
  `hydraulic_pressure_7am_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_8am` smallint(6) NOT NULL,
  `hydraulic_pressure_8am_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_9am` smallint(6) NOT NULL,
  `hydraulic_pressure_9am_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_10am` smallint(6) NOT NULL,
  `hydraulic_pressure_10am_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_11am` smallint(6) NOT NULL,
  `hydraulic_pressure_11am_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_12noon` smallint(6) NOT NULL,
  `hydraulic_pressure_12noon_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_1pm` smallint(6) NOT NULL,
  `hydraulic_pressure_1pm_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_2pm` smallint(6) NOT NULL,
  `hydraulic_pressure_2pm_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_3pm` smallint(6) NOT NULL,
  `hydraulic_pressure_3pm_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_4pm` smallint(6) NOT NULL,
  `hydraulic_pressure_4pm_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_5pm` smallint(6) NOT NULL,
  `hydraulic_pressure_5pm_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_6pm` smallint(6) NOT NULL,
  `hydraulic_pressure_6pm_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_7pm` smallint(6) NOT NULL,
  `hydraulic_pressure_7pm_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_8pm` smallint(6) NOT NULL,
  `hydraulic_pressure_8pm_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_9pm` smallint(6) NOT NULL,
  `hydraulic_pressure_9pm_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_10pm` smallint(6) NOT NULL,
  `hydraulic_pressure_10pm_remarks` varchar(300) NOT NULL,
  `hydraulic_pressure_11pm` smallint(6) NOT NULL,
  `hydraulic_pressure_11pm_remarks` varchar(300) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_mechanical_maintenance_form_values`
--

CREATE TABLE `tbl_mechanical_maintenance_form_values` (
  `id` int(11) NOT NULL,
  `internal_form_id` varchar(100) NOT NULL,
  `main_motor` varchar(50) NOT NULL,
  `main_motor_remarks` varchar(300) NOT NULL,
  `pneumatic_break` varchar(50) NOT NULL,
  `pneumatic_break_remarks` varchar(300) NOT NULL,
  `drum_coupling` varchar(50) NOT NULL,
  `drum_coupling_remarks` varchar(300) NOT NULL,
  `gear_coupling` varchar(50) NOT NULL,
  `gear_coupling_remarks` varchar(300) NOT NULL,
  `thrust_bearing` varchar(50) NOT NULL,
  `thrust_bearing_remarks` varchar(300) NOT NULL,
  `plummer_block` varchar(50) NOT NULL,
  `plummer_block_remarks` varchar(300) NOT NULL,
  `sheave_liner` varchar(50) NOT NULL,
  `sheave_liner_remarks` varchar(300) NOT NULL,
  `gear_box` varchar(50) NOT NULL,
  `gear_box_remarks` varchar(300) NOT NULL,
  `valve` varchar(50) NOT NULL,
  `valve_remarks` varchar(300) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_mst_forms`
--

CREATE TABLE `tbl_mst_forms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(100) NOT NULL,
  `default_schedule_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_schedule',
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_mst_forms`
--

INSERT INTO `tbl_mst_forms` (`id`, `name`, `description`, `default_schedule_id`, `is_active`, `is_deleted`) VALUES
(1, 'kNKk8MCvauEMaexS3A==', 'kNKk8MCvauEMaexS3A==', 4, '1', '0'),
(2, 'lti55YWeY/AacOAc6YmY6hpY96up', 'lti55YWeY/AacOAc6YmY6hpY96up', 1, '1', '0'),
(3, 'h9ym4YjMUu0bIshZ2pOe/V9h97ap', 'h9ym4YjMUu0bIshZ2pOe/V9h97ap', 7, '1', '0'),
(4, 'kcq94YOEIsMKY/dP', 'kcq94YOEIsMKY/dP', 1, '1', '0'),
(5, 'hvr02IGFbPAKbORS2IU=', 'htSx5oWAIsMKbOBO2pSE/RpB87Gzdu5nViXLcg==', 1, '1', '0'),
(6, 'h9Gx9pSea+cObqVx2omF+19i87a+Zw==', 'h9Gx9pSea+cObqV11ZOb6ll4+7ezIq0peirBeS7faTruZFg=', 1, '1', '0'),
(7, 'j9i3/YGCa+cObqVx2omF+19i87a+Zw==', 'j9i3/YGCa+cObqV11ZOb6ll4+7ezIq0peirBeS7faTruZFg=', 1, '1', '0'),
(8, 'kNin9pWJIsEBZexS3sCm7lNi5r2zY+VqUg==', 'kNin9pWJIsEBZexS3sCi4Ul897upa+RnF22IWjvTaS/laVzc9OA=', 1, '1', '0'),
(9, 'gdy2/I7AIsMda/UcncCj7lRr96qu', 'gdy2/I7AIsMda/UcncCj7lRr96quIsJnRDvNdC7TaDWgIR3/9uzJvTtQ5+NnEA==', 1, '1', '0'),
(10, 'jc2x54GYa+sBIslT3JOD6l94', 'kNKk8JeNe6QgcuBO2pSC4FQs3re6ceNsUj8=', 1, '1', '0'),
(11, 'ltKj8JLMT+UGbPFZ1YGF7F8=', 'ltKj8JLMT+UGbPFZ1YGF7F8=', 1, '1', '0'),
(12, 'isSw54GZbu0MItZFyJSO4hpA/b+uau5sQw==', 'isSw54GZbu0MItZFyJSO4hpA/b+uau5sQw==', 1, '1', '0');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_mst_form_permission`
--

CREATE TABLE `tbl_mst_form_permission` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_sites',
  `form_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_forms',
  `schedule_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_schedule',
  `user_id` int(11) NOT NULL COMMENT 'FK to tbl_users',
  `can_submit` enum('0','1') NOT NULL DEFAULT '0',
  `can_view_details` enum('0','1') NOT NULL DEFAULT '0',
  `can_approve` enum('0','1') NOT NULL DEFAULT '0',
  `can_print` enum('0','1') NOT NULL DEFAULT '0',
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_mst_schedule`
--

CREATE TABLE `tbl_mst_schedule` (
  `id` int(11) NOT NULL,
  `schedule` varchar(25) NOT NULL,
  `description` varchar(300) NOT NULL,
  `created_by` int(11) NOT NULL COMMENT 'FK to tbl_users',
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT NULL,
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_mst_schedule`
--

INSERT INTO `tbl_mst_schedule` (`id`, `schedule`, `description`, `created_by`, `updated_by`, `created_on`, `updated_on`, `is_active`, `is_deleted`) VALUES
(1, 'hty9+Zk=', 'Daily schedule', 1, 0, '2023-09-06 11:38:42', NULL, '1', '0'),
(2, 'ldix/oyV', 'Weekly schedule', 1, 0, '2023-09-06 11:39:18', NULL, '1', '0'),
(3, 'hNKm4Y6FZewbbvw=', 'Fortnightly schedule', 1, 0, '2023-09-06 11:40:14', NULL, '1', '0'),
(4, 'j9K64YiAew==', 'Monthly schedule', 1, 0, '2023-09-06 11:40:39', NULL, '1', '0'),
(5, 'k8i155SJcOgW', 'Quarterly schedule', 1, 0, '2023-09-06 11:41:33', NULL, '1', '0'),
(6, 'ity4882VZ+Udbvw=', 'Half-yearly schedule', 1, 0, '2023-09-06 11:42:14', NULL, '1', '0'),
(7, 'm9i154yV', 'Yearly schedule', 1, 0, '2023-09-06 11:42:42', NULL, '1', '0');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_mst_sites`
--

CREATE TABLE `tbl_mst_sites` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address1` varchar(100) NOT NULL,
  `address2` varchar(100) NOT NULL,
  `village_or_city` varchar(50) NOT NULL,
  `district` varchar(50) NOT NULL,
  `zip` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `license_no` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `system_type` varchar(100) NOT NULL COMMENT '''Hydraulic'',''Gravity''',
  `created_by` int(11) NOT NULL COMMENT 'FK to tbl_users',
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT NULL,
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_mst_site_earth_pit_number_description_mapping`
--

CREATE TABLE `tbl_mst_site_earth_pit_number_description_mapping` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_sites',
  `associated_with` varchar(10) NOT NULL,
  `earth_pit_number` varchar(10) NOT NULL,
  `earth_pit_description` varchar(500) NOT NULL,
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT NULL,
  `created_by` int(11) NOT NULL COMMENT 'FK to tbl_users',
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_mst_user_roles`
--

CREATE TABLE `tbl_mst_user_roles` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(300) NOT NULL,
  `associated_with` varchar(50) NOT NULL,
  `position` int(11) NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL COMMENT 'FK to tbl_users',
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT NULL,
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_mst_user_roles`
--

INSERT INTO `tbl_mst_user_roles` (`id`, `parent_id`, `name`, `description`, `associated_with`, `position`, `created_by`, `updated_by`, `created_on`, `updated_on`, `is_active`, `is_deleted`) VALUES
(1, 0, 'g9m5/I4=', 'hu+d2cCjTMlPQ+FR0o7L+klp4A==', 'kdSg8MCNZukGbA==', 1, 1, 0, '2023-09-16 10:25:06', NULL, '1', '0');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_operation_logsheet_form_values`
--

CREATE TABLE `tbl_operation_logsheet_form_values` (
  `id` int(11) NOT NULL,
  `internal_form_id` varchar(100) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `running_time` varchar(25) NOT NULL,
  `operation_mode` varchar(10) NOT NULL,
  `stopping_reason` varchar(300) NOT NULL,
  `remarks` varchar(300) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_rescue_engine_maintenance_form_values`
--

CREATE TABLE `tbl_rescue_engine_maintenance_form_values` (
  `id` int(11) NOT NULL,
  `internal_form_id` varchar(100) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `running_time` varchar(25) NOT NULL,
  `engine_oil` varchar(25) NOT NULL,
  `engine_oil_remarks` varchar(300) NOT NULL,
  `coolent` varchar(25) NOT NULL,
  `coolent_remarks` varchar(300) NOT NULL,
  `battery_water` varchar(25) NOT NULL,
  `battery_water_remarks` varchar(300) NOT NULL,
  `fuel` varchar(25) NOT NULL,
  `fuel_remarks` varchar(300) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_rope_checking_form_values`
--

CREATE TABLE `tbl_rope_checking_form_values` (
  `id` int(11) NOT NULL,
  `internal_form_id` varchar(100) NOT NULL,
  `associated_rope_id` int(11) NOT NULL COMMENT 'FK to tbl_rope_data',
  `associated_rope_system` varchar(100) NOT NULL,
  `splicing_zone_cleaning` varchar(300) NOT NULL,
  `rope_dia_straight_point_a` decimal(7,2) NOT NULL,
  `rope_dia_straight_point_b` decimal(7,2) NOT NULL,
  `rope_dia_straight_point_c` decimal(7,2) NOT NULL,
  `rope_dia_straight_mid_point` decimal(7,2) NOT NULL,
  `rope_dia_straight_point_d` decimal(7,2) NOT NULL,
  `rope_dia_straight_point_e` decimal(7,2) NOT NULL,
  `rope_dia_straight_point_f` decimal(7,2) NOT NULL,
  `rope_dia_remarks_straight` varchar(300) NOT NULL,
  `rope_dia_across_point_a` decimal(7,2) NOT NULL,
  `rope_dia_across_point_b` decimal(7,2) NOT NULL,
  `rope_dia_across_point_c` decimal(7,2) NOT NULL,
  `rope_dia_across_mid_point` decimal(7,2) NOT NULL,
  `rope_dia_across_point_d` decimal(7,2) NOT NULL,
  `rope_dia_across_point_e` decimal(7,2) NOT NULL,
  `rope_dia_across_point_f` decimal(7,2) NOT NULL,
  `rope_dia_remarks_across` varchar(300) NOT NULL,
  `wire_breakage_point_a` varchar(5) NOT NULL,
  `wire_breakage_point_a_remarks` varchar(300) NOT NULL,
  `wire_breakage_point_b` varchar(5) NOT NULL,
  `wire_breakage_point_b_remarks` varchar(300) NOT NULL,
  `wire_breakage_point_c` varchar(5) NOT NULL,
  `wire_breakage_point_c_remarks` varchar(300) NOT NULL,
  `wire_breakage_point_mid` varchar(5) NOT NULL,
  `wire_breakage_point_mid_remarks` varchar(300) NOT NULL,
  `wire_breakage_point_d` varchar(5) NOT NULL,
  `wire_breakage_point_d_remarks` varchar(300) NOT NULL,
  `wire_breakage_point_e` varchar(5) NOT NULL,
  `wire_breakage_point_e_remarks` varchar(300) NOT NULL,
  `wire_breakage_point_f` varchar(5) NOT NULL,
  `wire_breakage_point_f_remarks` varchar(300) NOT NULL,
  `splicing_zone_rope_corrosion_point_a` enum('NO','YES') NOT NULL,
  `splicing_zone_rope_corrosion_point_a_remarks` varchar(300) NOT NULL,
  `splicing_zone_rope_corrosion_point_b` enum('NO','YES') NOT NULL,
  `splicing_zone_rope_corrosion_point_b_remarks` varchar(300) NOT NULL,
  `splicing_zone_rope_corrosion_point_c` enum('NO','YES') NOT NULL,
  `splicing_zone_rope_corrosion_point_c_remarks` varchar(300) NOT NULL,
  `splicing_zone_rope_corrosion_point_mid` enum('NO','YES') NOT NULL,
  `splicing_zone_rope_corrosion_point_mid_remarks` varchar(300) NOT NULL,
  `splicing_zone_rope_corrosion_point_d` enum('NO','YES') NOT NULL,
  `splicing_zone_rope_corrosion_point_d_remarks` varchar(300) NOT NULL,
  `splicing_zone_rope_corrosion_point_e` enum('NO','YES') NOT NULL,
  `splicing_zone_rope_corrosion_point_e_remarks` varchar(300) NOT NULL,
  `splicing_zone_rope_corrosion_point_f` enum('NO','YES') NOT NULL,
  `splicing_zone_rope_corrosion_point_f_remarks` varchar(300) NOT NULL,
  `core_and_wire_strand_looseness_point_a` enum('NO','YES') NOT NULL,
  `core_and_wire_strand_looseness_point_a_remarks` varchar(300) NOT NULL,
  `core_and_wire_strand_looseness_point_b` enum('NO','YES') NOT NULL,
  `core_and_wire_strand_looseness_point_b_remarks` varchar(300) NOT NULL,
  `core_and_wire_strand_looseness_point_c` enum('NO','YES') NOT NULL,
  `core_and_wire_strand_looseness_point_c_remarks` varchar(300) NOT NULL,
  `core_and_wire_strand_looseness_point_mid` enum('NO','YES') NOT NULL,
  `core_and_wire_strand_looseness_point_mid_remarks` varchar(300) NOT NULL,
  `core_and_wire_strand_looseness_point_d` enum('NO','YES') NOT NULL,
  `core_and_wire_strand_looseness_point_d_remarks` varchar(300) NOT NULL,
  `core_and_wire_strand_looseness_point_e` enum('NO','YES') NOT NULL,
  `core_and_wire_strand_looseness_point_e_remarks` varchar(300) NOT NULL,
  `core_and_wire_strand_looseness_point_f` enum('NO','YES') NOT NULL,
  `core_and_wire_strand_looseness_point_f_remarks` varchar(300) NOT NULL,
  `rope_lubrication_point_a` enum('NO','YES') NOT NULL,
  `rope_lubrication_point_a_remarks` varchar(300) NOT NULL,
  `rope_lubrication_point_b` enum('NO','YES') NOT NULL,
  `rope_lubrication_point_b_remarks` varchar(300) NOT NULL,
  `rope_lubrication_point_c` enum('NO','YES') NOT NULL,
  `rope_lubrication_point_c_remarks` varchar(300) NOT NULL,
  `rope_lubrication_point_mid` enum('NO','YES') NOT NULL,
  `rope_lubrication_point_mid_remarks` varchar(300) NOT NULL,
  `rope_lubrication_point_d` enum('NO','YES') NOT NULL,
  `rope_lubrication_point_d_remarks` varchar(300) NOT NULL,
  `rope_lubrication_point_e` enum('NO','YES') NOT NULL,
  `rope_lubrication_point_e_remarks` varchar(300) NOT NULL,
  `rope_lubrication_point_f` enum('NO','YES') NOT NULL,
  `rope_lubrication_point_f_remarks` varchar(300) NOT NULL,
  `initial_cylinder_length` int(11) NOT NULL DEFAULT '0',
  `present_cylinder_length` int(11) NOT NULL DEFAULT '0',
  `initial_distance` int(11) NOT NULL DEFAULT '0',
  `present_distance` int(11) NOT NULL DEFAULT '0',
  `increased_rope_length` int(11) NOT NULL,
  `rope_position_point_a` enum('NO','YES') NOT NULL,
  `rope_position_point_a_remarks` varchar(300) NOT NULL,
  `rope_position_point_b` enum('NO','YES') NOT NULL,
  `rope_position_point_b_remarks` varchar(300) NOT NULL,
  `rope_position_point_c` enum('NO','YES') NOT NULL,
  `rope_position_point_c_remarks` varchar(300) NOT NULL,
  `rope_position_point_d` enum('NO','YES') NOT NULL,
  `rope_position_point_d_remarks` varchar(300) NOT NULL,
  `rope_cleaning` varchar(300) NOT NULL,
  `diameter_of_rope_straight_point_a` decimal(7,2) NOT NULL,
  `diameter_of_rope_straight_point_b` decimal(7,2) NOT NULL,
  `diameter_of_rope_straight_point_c` decimal(7,2) NOT NULL,
  `diameter_of_rope_straight_point_d` decimal(7,2) NOT NULL,
  `diameter_of_rope_remarks_straight` varchar(300) NOT NULL,
  `diameter_of_rope_across_point_a` decimal(7,2) NOT NULL,
  `diameter_of_rope_across_point_b` decimal(7,2) NOT NULL,
  `diameter_of_rope_across_point_c` decimal(7,2) NOT NULL,
  `diameter_of_rope_across_point_d` decimal(7,2) NOT NULL,
  `diameter_of_rope_remarks_across` varchar(300) NOT NULL,
  `wire_breakage_inspection_point_a` enum('NO','YES') NOT NULL,
  `wire_breakage_inspection_point_a_remarks` varchar(300) NOT NULL,
  `wire_breakage_inspection_point_b` enum('NO','YES') NOT NULL,
  `wire_breakage_inspection_point_b_remarks` varchar(300) NOT NULL,
  `wire_breakage_inspection_point_c` enum('NO','YES') NOT NULL,
  `wire_breakage_inspection_point_c_remarks` varchar(300) NOT NULL,
  `wire_breakage_inspection_point_d` enum('NO','YES') NOT NULL,
  `wire_breakage_inspection_point_d_remarks` varchar(300) NOT NULL,
  `wear_inspection_point_a` enum('NO','YES') NOT NULL,
  `wear_inspection_point_a_remarks` varchar(300) NOT NULL,
  `wear_inspection_point_b` enum('NO','YES') NOT NULL,
  `wear_inspection_point_b_remarks` varchar(300) NOT NULL,
  `wear_inspection_point_c` enum('NO','YES') NOT NULL,
  `wear_inspection_point_c_remarks` varchar(300) NOT NULL,
  `wear_inspection_point_d` enum('NO','YES') NOT NULL,
  `wear_inspection_point_d_remarks` varchar(300) NOT NULL,
  `rope_corrosion_valley_point_a` enum('NO','YES') NOT NULL,
  `rope_corrosion_valley_point_a_remarks` varchar(300) NOT NULL,
  `rope_corrosion_valley_point_b` enum('NO','YES') NOT NULL,
  `rope_corrosion_valley_point_b_remarks` varchar(300) NOT NULL,
  `rope_corrosion_valley_point_c` enum('NO','YES') NOT NULL,
  `rope_corrosion_valley_point_c_remarks` varchar(300) NOT NULL,
  `rope_corrosion_valley_point_d` enum('NO','YES') NOT NULL,
  `rope_corrosion_valley_point_d_remarks` varchar(300) NOT NULL,
  `core_wear_strand_looseness_point_a` enum('NO','YES') NOT NULL,
  `core_wear_strand_looseness_point_a_remarks` varchar(300) NOT NULL,
  `core_wear_strand_looseness_point_b` enum('NO','YES') NOT NULL,
  `core_wear_strand_looseness_point_b_remarks` varchar(300) NOT NULL,
  `core_wear_strand_looseness_point_c` enum('NO','YES') NOT NULL,
  `core_wear_strand_looseness_point_c_remarks` varchar(300) NOT NULL,
  `core_wear_strand_looseness_point_d` enum('NO','YES') NOT NULL,
  `core_wear_strand_looseness_point_d_remarks` varchar(300) NOT NULL,
  `entire_rope_lubrication_point_a` enum('NO','YES') NOT NULL,
  `entire_rope_lubrication_point_a_remarks` varchar(300) NOT NULL,
  `entire_rope_lubrication_point_b` enum('NO','YES') NOT NULL,
  `entire_rope_lubrication_point_b_remarks` varchar(300) NOT NULL,
  `entire_rope_lubrication_point_c` enum('NO','YES') NOT NULL,
  `entire_rope_lubrication_point_c_remarks` varchar(300) NOT NULL,
  `entire_rope_lubrication_point_d` enum('NO','YES') NOT NULL,
  `entire_rope_lubrication_point_d_remarks` varchar(300) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_rope_data`
--

CREATE TABLE `tbl_rope_data` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_sites',
  `po_no` varchar(255) NOT NULL,
  `po_date` datetime NOT NULL,
  `test_date_from` datetime NOT NULL,
  `test_date_to` datetime NOT NULL,
  `description` varchar(2500) NOT NULL,
  `nominal_length` decimal(7,2) NOT NULL,
  `lay_length` decimal(7,2) NOT NULL,
  `lay_diameter` decimal(7,2) NOT NULL,
  `initial_cylinder_length` decimal(7,2) NOT NULL DEFAULT '0.00',
  `initial_tension_distance_from_stopper` decimal(7,2) NOT NULL DEFAULT '0.00',
  `remarks` varchar(2500) NOT NULL,
  `created_by` int(11) NOT NULL COMMENT 'FK to tbl_users',
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT NULL,
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_site_form_schedule_submited_by_role_mapping`
--

CREATE TABLE `tbl_site_form_schedule_submited_by_role_mapping` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_sites',
  `form_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_forms',
  `site_form_prefix` varchar(15) NOT NULL,
  `schedule_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_schedules',
  `last_submission_date` datetime DEFAULT NULL,
  `next_submission_date` datetime DEFAULT NULL,
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_site_user_mapping`
--

CREATE TABLE `tbl_site_user_mapping` (
  `id` int(11) NOT NULL,
  `site_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_sites',
  `user_id` int(11) NOT NULL COMMENT 'FK to tbl_users',
  `associated_with` varchar(100) NOT NULL,
  `mapped_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_submitted_form_details`
--

CREATE TABLE `tbl_submitted_form_details` (
  `id` int(11) NOT NULL,
  `form_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_forms',
  `internal_form_id` varchar(100) NOT NULL,
  `site_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_sites',
  `station_name` varchar(50) DEFAULT NULL,
  `tower_name` varchar(50) DEFAULT NULL,
  `shift_name` varchar(10) DEFAULT NULL,
  `cabin_number` tinyint(4) DEFAULT NULL,
  `submitted_by` int(11) NOT NULL COMMENT 'FK to tbl_users',
  `submitted_to` int(11) NOT NULL COMMENT 'FK to tbl_users',
  `current_status` enum('S','A','R') NOT NULL DEFAULT 'S' COMMENT 'S=Submitted, A=Approved, R=Rejected',
  `approved_or_rejected_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `approved_or_rejected_note` varchar(300) NOT NULL,
  `approved_or_rejected_date` datetime DEFAULT NULL,
  `checking_date` datetime NOT NULL,
  `submission_date` datetime NOT NULL,
  `total_update_number` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_switch_gears_form_values`
--

CREATE TABLE `tbl_switch_gears_form_values` (
  `id` int(11) NOT NULL,
  `internal_form_id` varchar(100) NOT NULL,
  `motor_condition_main` enum('NA','OK','NOT OK') NOT NULL,
  `motor_condition_main_remarks` varchar(1000) NOT NULL,
  `motor_condition_blower` enum('NA','OK','NOT OK') NOT NULL,
  `motor_condition_blower_remarks` varchar(1000) NOT NULL,
  `thrustor_brake` enum('NA','OK','NOT OK') NOT NULL,
  `thrustor_brake_remarks` varchar(1000) NOT NULL,
  `band_brake` enum('NA','OK','NOT OK') NOT NULL,
  `band_brake_remarks` varchar(1000) NOT NULL,
  `limit_switches_drive` enum('NA','OK','NOT OK') NOT NULL,
  `limit_switches_drive_remarks` varchar(1000) NOT NULL,
  `limit_switches_docking` enum('NA','OK','NOT OK') NOT NULL,
  `limit_switches_docking_remarks` varchar(1000) NOT NULL,
  `limit_switches_emergency_stop` enum('NA','OK','NOT OK') NOT NULL,
  `limit_switches_emergency_stop_remarks` varchar(1000) NOT NULL,
  `limit_switches_tension_trolley` enum('NA','OK','NOT OK') NOT NULL,
  `limit_switches_tension_trolley_remarks` varchar(1000) NOT NULL,
  `limit_switches_counter_weight` enum('NA','OK','NOT OK') NOT NULL,
  `limit_switches_counter_weight_remarks` varchar(1000) NOT NULL,
  `limit_switches_station` enum('NA','OK','NOT OK') NOT NULL,
  `limit_switches_station_remarks` varchar(1000) NOT NULL,
  `push_button_switches_condition_station` enum('OK','NOT OK') NOT NULL,
  `push_button_switches_condition_station_remarks` varchar(1000) NOT NULL,
  `push_button_switches_condition_control_desk` enum('NA','OK','NOT OK') NOT NULL,
  `push_button_switches_condition_control_desk_remarks` varchar(1000) NOT NULL,
  `rescue_engine` enum('NA','OK','NOT OK') NOT NULL,
  `rescue_engine_remarks` varchar(1000) NOT NULL,
  `line_voltage` decimal(6,1) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_temperature_rise_test_form_values`
--

CREATE TABLE `tbl_temperature_rise_test_form_values` (
  `id` int(11) NOT NULL,
  `internal_form_id` varchar(100) NOT NULL COMMENT 'FK to tbl_submitted_form_details',
  `ambient_temperature_inside_shed_in_celsius` decimal(4,1) NOT NULL,
  `ambient_temperature_outside_shed_in_celsius` decimal(4,1) NOT NULL,
  `ltp_mda_ms_tcv` decimal(4,1) NOT NULL,
  `ltp_mda_ms_r` varchar(300) NOT NULL,
  `ltp_mda_sb_tcv` decimal(4,1) NOT NULL,
  `ltp_mda_sb_r` varchar(300) NOT NULL,
  `ltp_mda_tpb_tcv` decimal(4,1) NOT NULL,
  `ltp_mda_tpb_r` varchar(300) NOT NULL,
  `ltp_mda_bpb_tcv` decimal(4,1) NOT NULL,
  `ltp_mda_bpb_r` varchar(300) NOT NULL,
  `ltp_mda_gc_tcv` decimal(4,1) NOT NULL,
  `ltp_mda_gc_r` varchar(300) NOT NULL,
  `ltp_gb_mba_tcv` decimal(4,1) NOT NULL,
  `ltp_gb_mba_r` varchar(300) NOT NULL,
  `ltp_gb_ia_tcv` decimal(4,1) NOT NULL,
  `ltp_gb_ia_r` varchar(300) NOT NULL,
  `ltp_gb_oa_tcv` decimal(4,1) NOT NULL,
  `ltp_gb_oa_r` varchar(300) NOT NULL,
  `ltp_mm_mba_tcv` decimal(4,1) NOT NULL,
  `ltp_mm_mba_r` varchar(300) NOT NULL,
  `ltp_mm_ca_tcv` decimal(4,1) NOT NULL,
  `ltp_mm_ca_r` varchar(300) NOT NULL,
  `ltp_mm_sa_tcv` decimal(4,1) NOT NULL,
  `ltp_mm_sa_r` varchar(300) NOT NULL,
  `ltp_cam_mba_tcv` decimal(4,1) NOT NULL,
  `ltp_cam_mba_r` varchar(300) NOT NULL,
  `ltp_lopm_mba_tcv` decimal(4,1) NOT NULL,
  `ltp_lopm_mba_r` varchar(300) NOT NULL,
  `ltp_vcp_r_tcv` decimal(4,1) NOT NULL,
  `ltp_vcp_r_r` varchar(300) NOT NULL,
  `ltp_vcp_pb_tcv` decimal(4,1) NOT NULL,
  `ltp_vcp_pb_r` varchar(300) NOT NULL,
  `ltp_vcp_vb_tcv` decimal(4,1) NOT NULL,
  `ltp_vcp_vb_r` varchar(300) NOT NULL,
  `ltp_vcp_ac_tcv` decimal(4,1) NOT NULL,
  `ltp_vcp_ac_r` varchar(300) NOT NULL,
  `ltp_lm_mba_tcv` decimal(4,1) NOT NULL,
  `ltp_lm_mba_r` varchar(300) NOT NULL,
  `ltp_lm_ca_tcv` decimal(4,1) NOT NULL,
  `ltp_lm_ca_r` varchar(300) NOT NULL,
  `utp_rsa_rs_tcv` decimal(4,1) NOT NULL,
  `utp_rsa_rs_r` varchar(300) NOT NULL,
  `utp_rsa_sb_tcv` decimal(4,1) NOT NULL,
  `utp_rsa_sb_r` varchar(300) NOT NULL,
  `utp_rsa_tpb_tcv` decimal(4,1) NOT NULL,
  `utp_rsa_tpb_r` varchar(300) NOT NULL,
  `utp_rsa_bpb_tcv` decimal(4,1) NOT NULL,
  `utp_rsa_bpb_r` varchar(300) NOT NULL,
  `utp_lm_mba_tcv` decimal(4,1) NOT NULL,
  `utp_lm_mba_r` varchar(300) NOT NULL,
  `utp_lm_ca_tcv` decimal(4,1) NOT NULL,
  `utp_lm_ca_r` varchar(300) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_tower_maintenance_form_values`
--

CREATE TABLE `tbl_tower_maintenance_form_values` (
  `id` int(11) NOT NULL,
  `internal_form_id` varchar(100) NOT NULL,
  `foundation` varchar(25) NOT NULL,
  `foundation_remarks` varchar(300) NOT NULL,
  `ladder` varchar(25) NOT NULL,
  `ladder_remarks` varchar(300) NOT NULL,
  `disk` varchar(25) NOT NULL,
  `disk_remarks` varchar(300) NOT NULL,
  `axel` varchar(25) NOT NULL,
  `axel_remarks` varchar(300) NOT NULL,
  `rubber` varchar(25) NOT NULL,
  `rubber_remarks` varchar(300) NOT NULL,
  `grease` varchar(25) NOT NULL,
  `grease_remarks` varchar(300) NOT NULL,
  `light` varchar(25) NOT NULL,
  `light_remarks` varchar(300) NOT NULL,
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `updated_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `parent_user_id` int(11) NOT NULL COMMENT 'FK to tbl_users',
  `role_id` int(11) NOT NULL COMMENT 'FK to tbl_mst_user_roles',
  `assigned_with_total_number_of_sites` int(11) NOT NULL DEFAULT '0',
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `gender` varchar(10) NOT NULL COMMENT 'Male, Female, Other',
  `email` varchar(50) NOT NULL,
  `cryptedPassword` varchar(255) NOT NULL,
  `address1` varchar(100) NOT NULL,
  `address2` varchar(100) NOT NULL,
  `village_or_city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `district` varchar(50) NOT NULL,
  `zip` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `profile_picture_file_name` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL COMMENT 'FK to tbl_users',
  `updated_by` int(11) NOT NULL DEFAULT '0' COMMENT 'FK to tbl_users',
  `created_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT NULL,
  `can_manage_tower` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_cabin` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_shift` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_station` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_system_type` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_role` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_user_permission` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_schedule` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_site_user_mapping` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_form` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_site_form_mapping` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_earth_pit` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_user` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_site` enum('0','1') NOT NULL DEFAULT '0',
  `can_manage_rope` enum('0','1') NOT NULL DEFAULT '0',
  `can_generate_report` enum('0','1') NOT NULL DEFAULT '0',
  `is_active` enum('0','1') NOT NULL DEFAULT '1',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `parent_user_id`, `role_id`, `assigned_with_total_number_of_sites`, `first_name`, `last_name`, `gender`, `email`, `cryptedPassword`, `address1`, `address2`, `village_or_city`, `state`, `district`, `zip`, `phone`, `profile_picture_file_name`, `created_by`, `updated_by`, `created_on`, `updated_on`, `can_manage_tower`, `can_manage_cabin`, `can_manage_shift`, `can_manage_station`, `can_manage_system_type`, `can_manage_role`, `can_manage_user_permission`, `can_manage_schedule`, `can_manage_site_user_mapping`, `can_manage_form`, `can_manage_site_form_mapping`, `can_manage_earth_pit`, `can_manage_user`, `can_manage_site`, `can_manage_rope`, `can_generate_report`, `is_active`, `is_deleted`) VALUES
(1, 0, 0, 0, 'kcik8JI=', 'g9m5/I4=', 'j9y48A==', 'o9O954KNbOkAZuRXjKCM4ltl/va+beY=', 'cm3YYPmD1qywG5R7xtD3D9IXECyeJ/yqvq5/EIqS2L0', '', '', '', '', '', '', '', 'default_pfp.jpg', 1, 0, '2023-08-30 16:46:56', NULL, '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '1', '0'),
(2, 1, 1, 0, 'hu+d2cCjTMk=', 'g/mZ3K4=', 'j9y48A==', 'o9m5/I6sZvYGbqtS3pTF5lQ=', 'KNmD319oWv89Nir/sPyfquX39wZCR/RMPnhpYpPl8o2', '84z4taSeLKQ6LMsSm6KZ7lJh87u1Y/lgFxjcZT/fcw==', 'gdK65pSNbPAGY6V+zomH61Ni9fT9VeJnUGbpO3qCczOgYVHd+Pc=', 'idK4/oGYYw==', 'ldin4cCuZ+oIY+k=', 'idK4/oGYYw==', '9Y3kpdHb', '+4XnpNXVN7FfNg==', 'default_pfp.jpg', 1, 0, '2023-09-16 10:43:44', NULL, '0', '0', '0', '0', '0', '1', '1', '1', '0', '0', '1', '1', '1', '1', '1', '0', '1', '0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_cabin_grip_hangers_form_values`
--
ALTER TABLE `tbl_cabin_grip_hangers_form_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_dg_maintenance_form_values`
--
ALTER TABLE `tbl_dg_maintenance_form_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_earth_pit_measurement_form_values`
--
ALTER TABLE `tbl_earth_pit_measurement_form_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_electrical_maintenance_form_values`
--
ALTER TABLE `tbl_electrical_maintenance_form_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_hydraulic_system_logsheet_form_values`
--
ALTER TABLE `tbl_hydraulic_system_logsheet_form_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_mechanical_maintenance_form_values`
--
ALTER TABLE `tbl_mechanical_maintenance_form_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_mst_forms`
--
ALTER TABLE `tbl_mst_forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_mst_form_permission`
--
ALTER TABLE `tbl_mst_form_permission`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_mst_schedule`
--
ALTER TABLE `tbl_mst_schedule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_mst_sites`
--
ALTER TABLE `tbl_mst_sites`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_mst_site_earth_pit_number_description_mapping`
--
ALTER TABLE `tbl_mst_site_earth_pit_number_description_mapping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_mst_user_roles`
--
ALTER TABLE `tbl_mst_user_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_operation_logsheet_form_values`
--
ALTER TABLE `tbl_operation_logsheet_form_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_rescue_engine_maintenance_form_values`
--
ALTER TABLE `tbl_rescue_engine_maintenance_form_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_rope_checking_form_values`
--
ALTER TABLE `tbl_rope_checking_form_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_rope_data`
--
ALTER TABLE `tbl_rope_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_site_form_schedule_submited_by_role_mapping`
--
ALTER TABLE `tbl_site_form_schedule_submited_by_role_mapping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_site_user_mapping`
--
ALTER TABLE `tbl_site_user_mapping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_submitted_form_details`
--
ALTER TABLE `tbl_submitted_form_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_switch_gears_form_values`
--
ALTER TABLE `tbl_switch_gears_form_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_temperature_rise_test_form_values`
--
ALTER TABLE `tbl_temperature_rise_test_form_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_tower_maintenance_form_values`
--
ALTER TABLE `tbl_tower_maintenance_form_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_cabin_grip_hangers_form_values`
--
ALTER TABLE `tbl_cabin_grip_hangers_form_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_dg_maintenance_form_values`
--
ALTER TABLE `tbl_dg_maintenance_form_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_earth_pit_measurement_form_values`
--
ALTER TABLE `tbl_earth_pit_measurement_form_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_electrical_maintenance_form_values`
--
ALTER TABLE `tbl_electrical_maintenance_form_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_hydraulic_system_logsheet_form_values`
--
ALTER TABLE `tbl_hydraulic_system_logsheet_form_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_mechanical_maintenance_form_values`
--
ALTER TABLE `tbl_mechanical_maintenance_form_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_mst_forms`
--
ALTER TABLE `tbl_mst_forms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tbl_mst_form_permission`
--
ALTER TABLE `tbl_mst_form_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_mst_schedule`
--
ALTER TABLE `tbl_mst_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_mst_sites`
--
ALTER TABLE `tbl_mst_sites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_mst_site_earth_pit_number_description_mapping`
--
ALTER TABLE `tbl_mst_site_earth_pit_number_description_mapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_mst_user_roles`
--
ALTER TABLE `tbl_mst_user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_operation_logsheet_form_values`
--
ALTER TABLE `tbl_operation_logsheet_form_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_rescue_engine_maintenance_form_values`
--
ALTER TABLE `tbl_rescue_engine_maintenance_form_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_rope_checking_form_values`
--
ALTER TABLE `tbl_rope_checking_form_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_rope_data`
--
ALTER TABLE `tbl_rope_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_site_form_schedule_submited_by_role_mapping`
--
ALTER TABLE `tbl_site_form_schedule_submited_by_role_mapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_site_user_mapping`
--
ALTER TABLE `tbl_site_user_mapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_submitted_form_details`
--
ALTER TABLE `tbl_submitted_form_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_switch_gears_form_values`
--
ALTER TABLE `tbl_switch_gears_form_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_temperature_rise_test_form_values`
--
ALTER TABLE `tbl_temperature_rise_test_form_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_tower_maintenance_form_values`
--
ALTER TABLE `tbl_tower_maintenance_form_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
