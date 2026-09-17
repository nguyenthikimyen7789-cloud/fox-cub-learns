# Trang chi tiết bài học tự động

## Mục tiêu
Tạo trang `/lessons/$id` để xem một bài học đã được hệ thống biên soạn, đồng bộ với giao diện Học Viện Cáo Nhỏ và dùng trực tiếp dữ liệu trong Lovable Cloud.

## Nội dung thực hiện
- Tải bài học theo mã cùng bài đọc, từ vựng, trắc nghiệm và dữ liệu trò chơi; hiển thị trạng thái không tìm thấy rõ ràng.
- Trình bày tiêu đề, cấp độ và ngôn ngữ; bài Tiếng Trung có công tắc bật/tắt Pinyin.
- Hiển thị từ vựng bằng các thẻ dễ đọc gồm từ, phiên âm, từ loại, nghĩa và ví dụ.
- Tạo trắc nghiệm A/B/C/D tương tác, khóa đáp án sau khi chọn và hiện đúng/sai cùng giải thích.
- Tạo trò ghép từ từ dữ liệu `lesson_games`, có trộn thẻ, phản hồi cặp đúng/sai, tiến độ và nút chơi lại.
- Đổi nút “Xem trước” trên trang quản trị sang đường dẫn mới `/lessons/$id`.
- Kiểm tra giao diện trên máy tính và điện thoại, kiểm tra đường dẫn, thao tác và trạng thái biên dịch.

## Chi tiết kỹ thuật
- Dùng server function để đọc đầy đủ dữ liệu bài học; trang gọi dữ liệu sau khi mở để không làm hỏng quá trình tạo bản xem trước khi chưa có phiên đăng nhập.
- Chuẩn hóa nhiều dạng JSON có thể xuất hiện trong `options` và `game_data`, đồng thời có phương án tạo cặp ghép từ từ danh sách từ vựng nếu game chưa đủ dữ liệu.
- Mỗi trang có tiêu đề và mô tả chia sẻ riêng theo bài học.
