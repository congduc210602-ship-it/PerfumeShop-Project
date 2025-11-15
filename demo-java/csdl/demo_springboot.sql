-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 30, 2025 lúc 06:36 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `demo_springboot`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banners`
--

CREATE TABLE `banners` (
  `id` bigint(20) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `display_order` int(11) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `banners`
--

INSERT INTO `banners` (`id`, `is_active`, `display_order`, `image_url`, `link_url`, `title`) VALUES
(1, b'1', 1, 'http://localhost:8080/uploads/95bfe45b58d44f6a8269d6b4dcb66be1.jpg', 'http://localhost:3000/products/14', 'gucci'),
(2, b'1', 2, 'http://localhost:8080/uploads/fb197d94002d48f59589fc2e93c8bca6.jpg', 'http://localhost:3000/products/18', 'burberry'),
(3, b'1', 3, 'http://localhost:8080/uploads/fd1ff2952f194a28b7259c83a36f6da7.jpg', 'http://localhost:3000/products/19', 'scandal');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brands`
--

CREATE TABLE `brands` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `brands`
--

INSERT INTO `brands` (`id`, `name`) VALUES
(4, 'Auth'),
(3, 'Burberry'),
(9, 'Ck'),
(2, 'Dior'),
(1, 'Gucci'),
(5, 'Scandal');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `carts`
--

CREATE TABLE `carts` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `cart_id` bigint(20) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Nước Hoa Nam'),
(2, 'Nước Hoa Nữ'),
(3, 'Nước Hoa Unisex');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `shipping_phone` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `total_price` double NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `price` double NOT NULL,
  `quantity` int(11) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` double DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `brand_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id`, `description`, `image_url`, `name`, `price`, `quantity`, `category_id`, `brand_id`) VALUES
(1, 'Hương Đầu: Quả bưởi, Quả mộc qua\nHương giữa: Hoa nhài, Hoa hồng\nHương cuối: Xạ hương trắng\n\nNước hoa Chanel Chance Eau Tendre Eau de Parfum thuộc nhóm hương Floral Fruity (Hương hoa cỏ trái cây). Hương Bưởi và quả Mộc Qua bắt đầu với sự nhẹ nhàng, đơn giản nhưng đầy tinh tế.  Chance Eau Tendre Eau de Parfum được đánh giá là một cô gái xinh đẹp với mái tóc bồng bềnh, sở hữu một nụ cười nhẹ nhàng và một mùi hương \"sạch sẽ\". Hoa Nhài và hoa Hồng khiến nàng trở nên ngọt ngào nhưng không hề gắt, và mọi sự chú ý sẽ dồn vào note hương cuối cùng của cô nàng  Chance Eau Tendre Eau de Parfum, Xạ hương trắng. Nếu bạn là một tín đồ của xạ hương, và cũng yêu thích sự tươi mát của hương hoa cây cỏ, thì đừng bao giờ bỏ qua cô nằng dịu dàng Chanel Chance Eau Tendre Eau de Parfum này nhé. ', 'http://localhost:8080/uploads/c1be6e9bb0cb4d7eb9b8d083f6e4aa53.jpg', 'Chanel Chance Eau Tendre Eau de Parfum', 2750000, 20, 2, 4),
(2, 'Hương đầu: Hương Biển, Quýt xanh\nHương giữa: Xô thơm, Oải hương, Chi Mỏ hạc\nHương cuối: Hương Khoáng, Cỏ Hương bài, Hoắc hương\n\nMang trong mình hơi thở Thuỷ sinh, Giorgio Armani Acqua di Gio Eau de Parfum là vẻ đẹp của một người đàn ông cá tính, hiện đại và có đôi phần \"ướt át\". Ra mắt từ năm 2022, ấn phẩm đươc sự đón nhận nồng nhiệt của giới mộ điệu, bởi đây không chỉ là một sự kế thừa và phát huy DNA của Acqua di Gio nguyên bản, mà còn là một phiên bản hoàn chỉnh của sự giao thoa giữa giữa bản gốc và bản Essenza.\n\nẤn phẩm là sự mô tả về một không gian rộng lớn và vô tận như đang đắm mình vào biển cả, không giới hạn, không chút áp lực và không có sự hạn chế. Hương thơm của Khoáng chất kết hợp cùng Quýt xanh, dịu ngọt nhưng cực tươi mát, lại càng nhấn mạnh vẻ đẹp của biển cả. Càng về sau, hương thơm càng nồng ấm, hoang dại của Xô thơm lẫn trong cái kết cấu phức tạp của Chi Mỏ hạc, tạo nên cái trầm lắng bên trong mỗi quý ông.', 'http://localhost:8080/uploads/c3e4418ed84e45bfbea89da4a36cae7d.jpg', 'Giorgio Armani Acqua di Gio Eau de Parfum', 2800000, 40, 1, NULL),
(3, 'Hương chính: Gỗ đàn hương, Da thuộc, Lá cói, Gỗ tuyết tùng, Hoa Violet, Bạch đậu khấu, Hoa diên vĩ, Nhựa hổ phách.\n\nSantal 33 của Le Labo chắc hẳn là một hiện tượng thú vị trong thập niên 2010s của thế giới mùi hương, thậm chí còn hâm nóng thị trường nước hoa thời điểm ấy một cách cuồng nhiệt bằng sự ảnh hưởng và nổi tiếng của mùi hương này. Vậy Le Labo Santal 33 có gì khác thường mà lại được yêu thích đến vậy?\n\nĐược ra mắt năm 2011, trong thời điểm sự trở lại của các nhà nước hoa niche đang dần lớn mạnh hơn, những mùi hương độc đáo, thú vị cũng được cộng đồng chào đón, và Santal 33 đã giới thiệu tới cộng đồng yêu hương một sự mới lạ hấp dẫn, ấy là “mùi mạt cưa”. Đúng, Santal 33 cho ta mùi hương giống với không khí trong một xưởng cưa đầy ắp mạt gỗ đàn hương thơm, tươi, ẩm ẩm, kèm chút bụi mang lại cảm giác phấn gỗ rất chân thật, đầy đủ hiệu ứng và cảm xúc.', 'http://localhost:8080/uploads/f3f757ea53f94dab89232fdbfd220378.jpg', 'Le Labo Santal 33', 6500000, 15, 3, NULL),
(4, 'Hương Đầu: Hoa nhài, Nhụy hoa nghệ tây\nHương giữa: Amberwood, Long diên hương\nHương cuối: Hương nhựa cây tùng, Gỗ tuyết tùng\n\nÁnh lên sự sang trong từ những viên kim cương đỏ quyền lực được nhuốm lên sắc vàng của sự xa xỉ, Maison Francis Kurkdjian Baccarat Rouge 540 EDP xuất hiện nổi bật giữa hàng nghìn mùi hương khác nhau trên thế giới. Cùng cái tên, vẻ ngoài và mùi hương đẳng cấp bên trong, Baccarat Rouge 540 chắc chắn là một trong những lựa chọn xa xỉ dành cho giới nhà giàu.\n\nKhác biệt hoàn toàn với nhiều mùi hương, Hoa nhài và Nhụy hoa nghệ tây lại là những nốt hương được xuất hiện ngay từ lúc ban đầu. Hòa hợp cùng với Amberwood và Long diên hương, Baccarat Rouge 540 thể hiện đầy đủ sự thăng trầm theo cách vô cùng tuyệt vời, đem tới cảm giác vừa nhẹ nhàng, bay bổng lại vừa nồng nàn, trầm ấm.', 'http://localhost:8080/uploads/ffeb36c5dbc743eda1c5a70063c1488a.jpg', 'Maison Francis Kurkdjian Baccarat Rouge 540 EDP', 7500000, 5, 3, NULL),
(5, 'Hương Đầu: Hạnh nhân, Nghệ tây\nHương giữa: Hoa nhài (Ai Cập), Gỗ tuyết tùng\nHương cuối: Xạ hương, Hương gỗ, Long diên hương\n\nXuất hiện như một phiên bản nâng cấp của Baccarat Rouge 540, mùi hương mới của Maison Francis Kurkdjian xuất hiện trước giới nước hoa với mùi hương mạnh mẽ hơn cùng với cái tên độc đáo là Baccarat Rouge 540 Extrait.\n\nĐem tới sức mạnh từ thế hệ mới, Baccarat Rouge 540 Extrait cho ra những hương thơm sang trọng cùng nét trẻ trung đầy màu sắc của thời hiện đại. Bằng cách sử dụng những nốt hương Hạnh nhân và Nghệ tây, tông hương đầu mang tới sự mạnh mẽ lan tỏa xung quanh cùng một chút dư vị đăng đắng kích thích khứu giác trở nên nhạy bén hơn.', 'http://localhost:8080/uploads/80f02e385691464a875741f7f6abe373.jpg', 'Maison Francis Kurkdjian Baccarat Rouge 540 Extrait de Parfum', 1080000, 4, 3, NULL),
(6, 'Hương đầu: Quả bưởi, Quả chanh vàng, Bạc hà, Tiêu hồng.\nHương giữa: Gừng, Nhục đậu khấu, Hoa nhài, Iso E Super.\nHương cuối: Nhang, Cỏ hương bài, Gỗ tuyết tùng, Gỗ đàn hương, Hoắc hương, Nhựa hương Labdanum, Xạ hương trắng.\n\nChanel Bleu de Chanel đã đem tới thế giới hương thơm một mùi hương dễ chịu. Cam chanh mở màn bằng nét đặc trưng của nốt hương Bưởi, tươi sáng mọng nước cùng Gừng thanh lịch sạch sẽ, rồi nhẹ nhàng thoang thoảng chút hương hoa. Gừng của Bleu de Chanel rõ ràng, dễ gần, đẹp và nịnh mũi. Lắng dần xuống, mùi hương của Bleu de Chanel trở nên dày và có chiều sâu hơn với Nhang mềm ngọt, cùng sự rắn chắc vững chãi của hương Gỗ, qua hương thơm từ Cỏ hương bài, Gỗ tuyết tùng và Đàn hương.\n\n', 'http://localhost:8080/uploads/ae110ef139294e3393bf34706f44084a.jpg', 'Chanel Bleu de Chanel Eau de Toilette', 3650000, 35, 1, NULL),
(7, 'Hương đầu: Hoa oải hương, Nốt hương xanh, Cam Bergamot, Bạc hà, Lá bách xù, Quả quýt.\nHương giữa: Hương cỏ xanh, Quả đào, Hoa nhài, Hoa lan Nam Phi, Hoa mộc lan, Hoa phong lan.\nHương cuối: Xạ hương, Gỗ đàn hương, Gỗ tuyết tùng, Vanilla, Nhựa hổ phách, Nhựa Opoponax.\n\nCK Be là một phiên bản tiếp nối sau sự thành công vang dội của CK One. Vẫn với phong cách mùi hương unisex, CK Be là một mùi hương tươi mát, sảng khoái tương tự người tiền nhiệm, nhưng được thêm vào một chút tính cánh riêng để tạo nên những điểm nhấn của riêng mình.\n\nCam chanh xuất hiện như một phần linh hồn của dòng hương này, tươi sáng, nhẹ nhàng, phảng phất qua lại giữa các lớp hương. CK Be nhấn mạnh vào những nốt hương xanh, ngai ngái, tươi màu lá, hòa quyện vào đó một chút thư thái cổ điển của Oải hương, đem tới cảm giác an lành dễ chịu. Những lớp hoa đan xen hòa vào cái khối hương ấy, thổi vào CK Be chất phi giới tính cân bằng, mọi thứ được giữ mở mức vừa đủ, không quá trớn, cũng không nhạt nhòa.', 'http://localhost:8080/uploads/c0afab2f6486422c951b8928357c920b.jpg', 'Calvin Klein CK Be', 1080000, 60, 3, NULL),
(8, 'Hương đầu: Bergamot, Quýt, Hoa bưởi\nHương giữa: Hoa Nhài, Cây Đại hoàng, Hoa Lan Nam Phi, Lily\nHương cuối: Hổ phách, Xạ Hương, Cỏ Hương Bài\n\nNếu bạn đang tìm kiếm một mùi hương, một chai nước hoa phá vỡ rào cản về giới tính thì CK All là câu trả lời hoàn hảo. Chữ All đã nói lên được thông điệp mà thương hiệu Calvin Klein mới gửi gắm qua mùi hương này.\n\nVới những nốt hương nổi trội từ Hoa Nhài, Quýt, CK All sẽ đem lại cho bạn một cảm giác sảng khoái, bừng tỉnh với mùi hương trong trẻo và thanh khiết từ hoa và quả. Ngoài vị tươi mát tựa như mùa xuân ra, thì khoác lên người mùi hương của CK All, chắc hẳn sẽ có người cảm giác như vừa bôi lên người một lớp sữa dưỡng thể, mượt mà, uyển chuyển nhờ vào Hổ phách và Xạ Hương.', 'http://localhost:8080/uploads/86cc620a9a7d4150a8636d133dc5e24e.jpg', 'Calvin Klein CK All', 1220000, 55, 3, NULL),
(9, 'Hương đầu: Cam Bergamot, Quýt\nHương giữa: Gỗ đàn hương\nHương cuối: Đậu tonka, Olibanum, Vani\n\nDior sauvage Parfum là phiên bản mới nhất trong bộ sưu tập nước hoa của nhà Dior trong dòng Sauvage, tiếp nối sự thành công của các phiên bản Sauvage EDT và Sauvage EDP. Một phiên bản mới được thiết kế đậm đà hơn nhưng vẫn giữ nguyên các ADN cốt lõi làm nên thương hiệu “Lady Killer” đình đám của Dior Sauvage. Chuyên gia Francois Demachy đã phát hành phiên bản Sauvage Parfume vào năm 2019, được lấy cảm hứng từ vùng thảo nguyên, thời điểm ánh trăng lên cao cùng bầu trời tối đen le lói ánh sáng của lửa trại.', 'http://localhost:8080/uploads/1f0fd644416545c99a4b4a7ae90773a9.jpg', 'Dior Sauvage Parfum', 3800000, 80, 1, NULL),
(10, 'Hương đầu: Tiêu hồng, Hoa cam Neroli, Quả chanh vàng.\nHương giữa: Rượu Rum, Cỏ hương bài Java, Lá xô thơm.\nHương cuối: Thuốc lá, Vanilla, Nhựa hương Styrax.\n\nVới Maison Magiela Replica Jazz club, chúng ta có một chai nước hoa chứa đầy đủ những thứ mà bạn cần muốn nó phải có. Đủ tươi, đủ say, đủ ngọt và cân bằng được các yếu tố ẩm – khô. Rượu Rum đến từ những giây phút đầu tiên mà chúng ta xịt Jazz Club lên da, ngọt dịu, tê tê, được làm tươi bởi những thành phần Cam chanh và dậy mùi. Rum say sưa, và sôi nổi, dần được tiết chế bởi hương Gỗ của Cỏ hương bài và Thuốc lá. Cỏ hương bài trong Jazz Club ấm áp và nồng nàn đặc trưng của Indonesia, bắt sóng tốt và nhịp nhàng với Rum tạo thành một thế cân bằng trong mùi hương cùng cái khô khô ám khói nhẹ của lá Thuốc lá.', 'http://localhost:8080/uploads/4cbd62da53e345579253aca359509494.jpg', 'Maison Margiela Replica Jazz Club', 3250000, 15, 1, NULL),
(11, 'Hương đầu: Bạc hà, Quả chanh vàng.\nHương giữa: Quả táo xanh, Hoa phong lữ đỏ.\nHương cuối: Đậu Tonka, Nhựa hổ phách.\n\nEros là dòng nước hoa được nhiều người biết tới và bán chạy nhất của nhà mốt Ý Versace. Điều đó thể hiện qua việc Eros đã chiếm được niềm tin của nhiều chàng trai trẻ trung năng động và là lựa chọn đầu tiên của họ khi tìm mùi hương cho bản thân.\n\nEros Parfum vẫn gợi cảm, vẫn phóng khoáng nhưng đã bớt đi phần trẻ trung quá độ của các phiên bản khác trước đây, trưởng thành hơn và không còn ồn ã như những chàng thanh niên mới lớn.', 'http://localhost:8080/uploads/40cce3bb8f5d4852bee63e1ab1ed546d.jpg', 'Versace Eros Parfum', 2700000, 55, 1, NULL),
(12, 'Hương đầu: Quả táo, Gừng, Cam Bergamot.\nHương giữa: Xô thơm, Quả bách xù, Hoa phong lữ đỏ.\nHương cuối: Nhựa hương, Đậu Tonka, Gỗ tuyết tùng, Cỏ hương bài, Nhựa hương Olibanum.\n\nYves Saint Laurent (YSL) Y Eau de Parfum có lẽ không còn xa lạ với các quý ông thân quen dùng nước hoa, đến mức cái tên này đã trở thành một đại diện cho hương thơm lịch lãm dành cho nam giới hiện đại. Bạn có biết tại sao lại như vậy không?\n\nCó thể nói, Y EDP là một hương thơm toàn diện để có thể trở thành “mùi hương đặc trưng” của bất kỳ quý ông nào, bởi sự dễ gần, dễ kiểm soát và có thể khoác lên mình bất cứ lúc nào ta muốn.', 'http://localhost:8080/uploads/68a8c35e4c214d3f9ff78f0b201e9a3f.jpg', 'Yves Saint Laurent Y Eau de Parfum', 3500000, 15, 1, NULL),
(13, 'Hương đầu: Mâm xôi \n\nHương giữa: Hoa cúc hoạ mi \n\nHương cuối: Gỗ khô, Xạ hương Cashmere\n\nTôi là một người yêu cái ngọt. Ngọt từ lời nói cho đến hành động, thậm chí là ngay cả mùi hương cũng sẽ khiến tôi thổn thức đến nao lòng. Và đương nhiên, từ trong chính con người tôi cũng chứa đậm những sắc thái ngọt ngào khác nhau. Điều đó vô tình là thế mạnh cũng lại chính là điểm yếu mà tôi cùng lúc sở hữu. \n\nMarc Jacobs Daisy Love là chai nước hoa chứa đựng mùi hương khiến tôi tan chảy ngay từ lần ngửi đầu tiên. Mở ra với hương thơm rạng rỡ đầy ngọt ngào của Mâm xôi khi vừa chạm mũi, Marc Jacobs Daisy Love thật sự rất biết cách lấy lòng những cô nàng nghiện ngọt như tôi. Theo sau đó là sự e ấp nhưng dạt dào tươi mới của Hoa cúc họa mi. Và len lỏi lan tỏa đến nốt hương Gỗ trầm ấm cùng Xạ hương thân thuộc tạo nên một sự gây nghiện nhất định, đồng thời cũng thể hiện một tinh thần tươi trẻ. ', 'http://localhost:8080/uploads/b32373948aea4987a8283b9174b61ea0.jpg', 'Marc Jacobs Daisy Love', 2550000, 60, 2, NULL),
(14, 'Hương đầu: Quả mâm xôi, Dừa\nHương giữa: Hoa mộc lan, Hoa nhài, Xô thơm\n\nHương cuối: Xạ hương, Hoắc hương, Hương gỗ\n\nGucci thực sự là một nhà hương biết cách yêu chiều khứu giác của phái đẹp khi liên tục cho ra những ấn phẩm từ nhóm Hương hoa. Nếu người chị cả Gorgeous Gardenia yêu kiều, Gorgeous Jasmine tươi trẻ, thì Gucci Flora Gorgeous Magnolia lại là một phiên bản bí ẩn, đằm thắm hơn cả.\n\nNói riêng về Hoa mộc lan, đây là thứ hoa \"khó chiều\" trong giới hương bởi không phải ai cũng có thể chế tác mùi hương này cho tròn trịa. Vốn dĩ Mộc lan có cho mình một nét hương nồng nàn, đượm một chút đăng đắng rất đặc trưng, và ấn tượng để lại trong ta ấy là sự cá tính.', 'http://localhost:8080/uploads/25622b7601914c8dbc5b0a1b5726f367.jpg', 'Gucci Flora Gorgeous Magnolia Mini Size', 456000, 5, 2, NULL),
(15, 'Hương đầu: Quả mọng đỏ, Trái yuzu, Lựu, Caramel\nHương giữa: Helvetolide, Hoa mẫu đơn, Hoa sen, Hoa mộc lan\nHương cuối: Ambrox Super, Norlimbanol, Xạ hương\n \n\"Viên đá quý\" cuối cùng cũng đã được Versace đem lại đường đua mùi hương dưới cái tên Versace Bright Crystal Parfum. Hứa hẹn vẫn sẽ đỏng đảnh và kiêu kỳ như bao ngày, thế nhưng lại da diết và chững chạc hơn rất nhiều so với bản gốc Versace Bright Crystal đấy!\n \nTrái tim của \"viên đá quý\" nhà Versace vẫn xoay quanh hoa và trái. Hoa sen vẫn tươi xanh và ngây thơ như ngày nào, xúng xính bung tỏa bên cạnh Mẫu đơn ngọt dịu và Mộc lan giản dị. Thế nhưng càng bóc tách các cánh hoa, ta lại càng thêm cảm nhận được xúc cảm ngọt ngào của Caramel, từng chút một chiếm lấy khứu giác ta.', 'http://localhost:8080/uploads/2a7372cef0a24759bbd42d3312d38a6e.jpg', 'Versace Bright Crystal Parfum', 3600000, 21, 2, NULL),
(16, 'Hương đầu: Lá Violet và Tuyết Tùng;\nHương giữa: Hoa Nhài Sambac và Orris;\nHương cuối: Da Thuộc, Hương Gỗ và Thuốc Lá.\n\nSự xuất hiện của siêu phẩm Tom Ford Ombre Leather vào năm 2018 đã tạo ra một làn sóng dữ dội bởi mùi hương Da Thuộc chủ đạo vô cùng nam tính. \n\nSau 3 năm, tức là năm 2021, một phiên bản mới nhất được ra mắt - Tom Ford Ombre Leather Parfum cùng những hình thái mới của một gã đàn ông được mô phỏng từ một khía cạnh khác biệt và vô cùng đặc biệt.\n\nTầng hương đầu xuất hiện cùng với mùi hương Gỗ Tuyết Tùng và Lá Violet đã mang đến một hỗn hợp cân bằng đầy tinh tế, mùi hương thanh ngọt hòa cùng hương trầm ấm của gỗ là một điều vô cùng táo bạo để mang lại một sự khác biệt đầy cá tính.', 'http://localhost:8080/uploads/a4413e091b014e9ba135ed2654b4b451.jpg', 'Tom Ford Ombre Leather Parfum', 3850000, 9, 1, NULL),
(17, 'Hương đầu: Quế, Nhục đậu khấu, Cam Bergamot.\nHương giữa: Quả chà là, Kẹo Praline, Hoa huệ.\nHương cuối: Vanilla, Đậu Tonka, Nhựa thơm (Benzoin, Myrrh, Amberwood), Gỗ Akigala.\n\nRa mắt vào năm 2022, Lattafa Khamrah nhanh chóng trở thành một trong những mùi hương nổi bật và được yêu thích nhất của thương hiệu Lattafa. Với thiết kế chai ấn tượng và mùi hương gây dấu ấn mạnh ngay từ lần xịt đầu tiên, Khamrah đã tạo nên làn sóng trong cộng đồng yêu nước hoa trên toàn cầu, đặc biệt được nhắc đến như một phiên bản “gợi nhớ” đến Kilian Angels’ Share, một mùi hương niche đình đám.\n\nPhù hợp cho cả nam và nữ, Lattafa Khamrah đặc biệt lý tưởng trong thời tiết se lạnh, các dịp hẹn hò, dạo phố hoặc sự kiện buổi tối. Đây là lựa chọn hoàn hảo cho những ai yêu thích phong cách ấm áp, ngọt ngào, quyến rũ với dấu ấn phương Đông hiện đại.', 'http://localhost:8080/uploads/44e69d2d4c0d4cf0ad85c1deb7481296.jpg', 'Lattafa Khamrah', 1500000, 12, 3, NULL),
(18, 'Hương đầu: Tiêu đen\nHương giữa: Da thuộc\nHương cuối: Gỗ tuyết tùng\n\nRa mắt vào năm 2025, Burberry Hero Parfum Intense là chương tiếp theo đầy táo bạo trong hành trình khẳng định bản sắc của dòng nước hoa Hero. Nếu Hero Eau de Toilette mang tinh thần phiêu lưu tươi sáng, Hero Eau de Parfum là sự chững chạc của gỗ trầm ấm, thì Hero Parfum Intense đưa mọi thứ lên một tầm cao mới: nam tính gai góc hơn, gợi cảm hơn và bản lĩnh hơn bao giờ hết.\n\nMùi hương mở đầu bằng hạt tiêu đen, mạnh mẽ sắc bén và nam tính, như một cú chạm mạnh vào giác quan. Ngay sau đó, nốt da thuộc xuất hiện rõ nét, không bóng bẩy hay quá mượt mà, mà là một thứ da thô ráp, mạnh mẽ, mang đậm khí chất đàn ông từng trải. Burberry chọn điểm kết là sự hiện diện bền vững của Gỗ tuyết tùng, tạo nên lớp nền khô, trầm và kéo dài đầy uy lực cho Hero Parfum Intense. Tổ hợp hương này làm nổi bật tinh thần “Hero”, như mộtngười anh hùng hiện đại, dám sống thật và đi con đường của riêng mình.', 'http://localhost:8080/uploads/0ab676bb9fcd431ebf8bd9d037f77b82.jpg', 'Burberry Hero Parfum Intense', 3125000, 23, 1, NULL),
(19, 'Hương đầu: Thảo quả (Bạch đậu khấu)\nHương giữa: Ngọc lan tây\nHương cuối: Vanilla\n\nVới sự kết hợp của ba nhà pha chế Daphné Bugey, Fabrice Pellegrin, và Nicolas Bonneville, Scandal Intense là phiên bản mới nhất trong dòng Scandal danh tiếng từ Jean Paul Gaultier. Sản phẩm mới này được định vị nhằm mang đến trải nghiệm đậm đặc, ngọt ngào và đầy cảm giác mê đắm hơn so với các phiên bản trước. \n\nMùi hương mở đầu bằng Bạch đậu khấu, một khởi đầu bắt \"mũi\", ấm áp và có chút tê nhẹ để đánh thức giác quan. Ngọc lan tây nồng nàn tiếp nối, đầy đằm thắm, mang đến sự nữ tính đích thực và cảm giác thư giãn, quyến rũ. Cuối cùng, lớp hương nền với Vanilla, ngọt ngào, dai dẳng, phủ lên da một tấm lụa mềm mại đầy mê hoặc. ', 'http://localhost:8080/uploads/88729782693449f3b1ee28bc1917e602.jpg', 'Jean Paul Gaultier Scandal Eau de Parfum Intense', 3990000, 39, 2, NULL),
(20, 'Hương Đầu: Hoa mẫu đơn, Hoa lan Nam Phi, Quả vải\nHương giữa: Hoa hồng, Hoa linh lan thung lũng\nHương cuối: Hổ phách, Gỗ tuyết tùng\n\n \n\nChloe Eau de Parfum là cô nàng khó định nghĩa nhất về độ tuổi của nhà Chloe. Bạn có thể thấy nhiều người bàn tán về một cô gái ở tuổi mới lớn, hồn nhiên và yêu đời ở nơi cô nàng này, và cũng sẽ bắt gặp nhiều cuộc hội thoại khác về Chloe Eau de Parfum, nhưng ở khía cạnh trưởng thành, cuốn hút và có chút gì đó táo bạo. Hãng Chloe đã từng giới thiệu ở ngày công bố Chloe Eau de Parfum rằng đây là một dòng nước hoa tinh tế, nhẹ nhàng và rất thiên nhiên, một dòng nước hoa đặc trưng của hoa cỏ phương đông, nhưng khi tiếp xúc với cô ấy, sự tươi sáng và ngập tràn tự do còn là điều mà hãng đã quên nhắn nhủ với những khách hàng trung thành của mình. Hoa hồng và Hoa mẫu đơn nhẹ nhàng đưa tâm trí của bạn vào một khu vườn nhiều hoa. ', 'http://localhost:8080/uploads/c59f12afad504b3f89baada6538ccc55.jpg', 'Chloe Eau de Parfum Mini Size', 380000, 5, 2, 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `password`, `role`, `username`) VALUES
(1, '$2a$10$TCN1skrGyplUg0BlYm9Gwe9mFEWT6yRqEtGPOtHrjpDVZX0QwVTki', 'ADMIN', 'admin'),
(2, '$2a$10$jmmGvvucMFRJZ4Qg1/I5gOgUItYvI9dArZb.yDfqWaTZRq0XCRLZq', 'USER', 'user1'),
(3, '$2a$10$DNXDYyqrKSp3rSctC00YD.QcPNZnuwt2j3y6Z3KAgkWHjf4W5LqYK', 'USER', 'user2'),
(4, '$2a$10$NRJITMDxohpUHwcwrCRun.sufoL4WZweZ0Y5e15lqrabNPX7roVrC', 'USER', 'admin1'),
(5, '$2a$10$iuM3PtAYJZTRymkjQF7qdeKB69TYlzw1mYngrEB1bdld069dk26Ey', 'USER', 'user3'),
(6, '$2a$10$ajn4KnlslCOiNTtQDxJCR.23kU5lxR.KnRGi0iPQvSvAuy5Z7UVma', 'USER', 'user4');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKoce3937d2f4mpfqrycbr0l93m` (`name`);

--
-- Chỉ mục cho bảng `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK64t7ox312pqal3p7fg9o503c2` (`user_id`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`),
  ADD KEY `FKl7je3auqyq1raj52qmwrgih8x` (`product_id`);

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  ADD KEY `FKlf6f9q956mt144wiv6p1yko16` (`product_id`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK1mtsbur82frn64de7balymq9s` (`category_id`),
  ADD KEY `FKh259gmj2fw5b2pqed7ii3rpnl` (`brand_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `FKl7je3auqyq1raj52qmwrgih8x` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `FKlf6f9q956mt144wiv6p1yko16` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Các ràng buộc cho bảng `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK1mtsbur82frn64de7balymq9s` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `FKh259gmj2fw5b2pqed7ii3rpnl` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
