import { CommonModule } from '@angular/common';
import { Component, inject, signal, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export type FacultyPage = {
  key: string;
  label: string;
  title: string;
  summary: string;
  logoSrc?: string;
  pdfSrc?: string;
  mediaAlt?: string;
  metaLine?: string;
  centerHeading?: string;
  paragraphs: string[];
  highlights: string[];
  sections?: {
    title: string;
    body?: string;
    items?: string[];
  }[];
};

export type StructureMember = {
  name: string;
  position: string;
  phone: string;
  email: string;
  duty?: string;
};

export type StructureLecturerGroup = {
  title: string;
  members: StructureMember[];
};

export type FacilityImage = {
  src: string;
  alt: string;
  caption: string;
};

@Component({
  selector: 'app-faculty-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faculty-detail.component.html',
  styleUrl: './faculty-detail.component.css'
})
export class FacultyDetailComponent {
  private readonly sanitizer = inject(DomSanitizer);

  @Input() selectedPageKey = 'mission';

  readonly structureContactLines = [
    "-    Văn phòng Khoa CNTT: phòng 106, tầng 10, nhà 15 tầng.",
    "-    Địa chỉ: 170 An Dương Vương, thành phố Quy Nhơn.",
    "-    Điện thoại: 0256.3646072",
    "-    Web site: kcntt.qnu.edu.vn",
  ];

  readonly structureLeadershipMembers: StructureMember[] = [
    { name: "TS. Lê Xuân Việt", position: "Trưởng Khoa", duty: "Phụ trách, quản lý khoa CNTT", phone: "0905.532296", email: "lexuanviet@qnu.edu.vn" },
    { name: "TS. Hồ Văn Lâm", position: "Phó trưởng Khoa", duty: "Công tác chuyên môn và Nghiên cứu khoa học", phone: "0919.391719", email: "hovanlam@qnu.edu.vn" },
    { name: "TS. Nguyễn Thanh Bình", position: "Bí thư Chi bộ, Phó trưởng Khoa", duty: "Công tác sinh viên, cơ sở vật chất và Quan hệ doanh nghiệp", phone: "0983.331601", email: "nguyenbinh@qnu.edu.vn" },
  ];

  readonly structureAssistantMembers: StructureMember[] = [
    { name: "CN. Lê Thị Thanh Hoa", position: "Chuyên viên", phone: "0934.944.455", email: "lethithanhhoa@qnu.edu.vn" },
    { name: "ThS. Võ Thị Ngọc Hiền", position: "Chuyên viên", phone: "0905.876898", email: "vothingochien@qnu.edu.vn" },
  ];

  readonly structureLecturerGroups: StructureLecturerGroup[] = [
    {
      title: " Nhóm giảng viên chương trình đào tạo chuyên ngành Kỹ thuật phần mềm",
      members: [
        { name: "TS. Phạm Văn Việt", position: "Giảng viên", phone: "0367.574755", email: "phamvanviet@qnu.edu.vn" },
        { name: "TS. Nguyễn Thanh Bình", position: "Giảng viên", phone: "0983.331601", email: "nguyenbinh@qnu.edu.vn" },
        { name: "ThS. Đinh Thị Mỹ Cảnh", position: "Giảng viên", phone: "0989.116767", email: "dinhthimycanh@qnu.edu.vn" },
        { name: "ThS. Đòan Thị Thu Cúc", position: "Giảng viên", phone: "0988.254468", email: "doanthithucuc@qnu.edu.vn" },
        { name: "ThS. Vũ Sơn Lâm", position: "Giảng viên", phone: "0986.131673", email: "vusonlam@qnu.edu.vn" },
        { name: "ThS. Nguyễn Thi Loan", position: "Giảng viên", phone: "0981.194466", email: "nguyenthiloan@qnu.edu.vn" },
        { name: "ThS. Phạm Trần Thiện", position: "Giảng viên", phone: "0989.399402", email: "phamtranthien@qnu.edu.vn" },
        { name: "ThS. Trần Hoàng Việt", position: "Giảng viên, Bí thư Liên chi đoàn Khoa", phone: "0378.791.693", email: "tranhoangviet@qnu.edu.vn" },
        { name: "ThS. Hùynh Ngọc Khoa", position: "Giảng viên", phone: "0939.083.233", email: "huynhngockhoa@qnu.edu.vn" },
      ],
    },
    {
      title: "  Nhóm giảng viên chương trình đào tạo chuyên ngành Mạng và Khoa học máy",
      members: [
        { name: "TS. Lê Quang Hùng", position: "Giảng viên", phone: "0983.344056", email: "lequanghung@qnu.edu.vn" },
        { name: "ThS. Dương Hòang Huyên", position: "Giảng viên", phone: "0937.032925", email: "duonghoanghuyen@qnu.edu.vn" },
        { name: "TS. Lê Thị Kim Nga", position: "Giảng viên", phone: "0906.555779", email: "lethikimnga@qnu.edu.vn" },
        { name: "TS. Lê Xuân Việt", position: "Giảng viên", phone: "0905.532296", email: "lexuanviet@qnu.edu.vn" },
        { name: "TS. Lê Xuân Vinh", position: "Giảng viên", phone: "0941.031785", email: "lexuanvinh@qnu.edu.vn" },
        { name: "TS. Nguyễn Thành Đạt", position: "Giảng viên", phone: "0905.139393", email: "nguyenthanhdat@qnu.edu.vn" },
        { name: "TS. Nguyễn Ngọc Dũng", position: "Giảng viên", phone: "0982.145072", email: "nguyengocdung@qnu.edu.vn" },
        { name: "ThS. Trần Đình Luyện", position: "Giảng viên", phone: "0983.480801", email: "trandinhluyen@qnu.edu.vn" },
        { name: "ThS. Phùng Văn Minh", position: "Giảng viên", phone: "0982.033722", email: "phungvanminh@qnu.edu.vn" },
      ],
    },
    {
      title: "Nhóm giảng viên chương trình đào tạo chuyên ngành Hệ thống thông tin",
      members: [
        { name: "TS. Trần Thiên Thành", position: "Giảng viên", phone: "0989.161116", email: "trantienthanh@qnu.edu.vn" },
        { name: "NCS. Đinh Thị Hồng Huyên", position: "Giảng viên", phone: "0987.351537", email: "dinhthihonghuyen@qnu.edu.vn" },
        { name: "TS. Hồ Văn Lâm", position: "Giảng viên", phone: "0919.391719", email: "hovanlam@qnu.edu.vn" },
        { name: "ThS. Trần Thị Liên", position: "Giảng viên", phone: "0983.177218", email: "tranthilien@qnu.edu.vn" },
        { name: "ThS. Võ Thị Mỹ", position: "Giảng viên", phone: "", email: "vothimy@qnu.edu.vn" },
        { name: "ThS. Nguyễn Thị Kim Phượng", position: "Giảng viên", phone: "0985.070001", email: "nguyenthikimphuong@qnu.edu.vn" },
        { name: "ThS. Phan Đình Sinh", position: "Giảng viên", phone: "0913.455288", email: "phandinhsinh@qnu.edu.vn" },
        { name: "TS. Nguyễn Thị Tuyết", position: "Giảng viên, CT.CDBP", phone: "0963.600126", email: "nguyenthituyet@qnu.edu.vn" },
      ],
    },
  ];

  readonly facilityIntroParagraphs = [
    "Được sự quan tâm và chỉ đạo của Đảng ủy Nhà trường, Ban Giám hiệu và các phòng ban chức năng đã đầu tư xây dựng, phát triển cơ sở vật chất phục vụ cho công tác đào tạo và nghiên cứu khoa học của giảng viên và sinh viên khoa Công nghệ Thông tin (CNTT), Trường Đại học Quy Nhơn.",
    "Trong nhiều năm qua, sinh viên khoa CNTT đã được học tập và nghiên cứu tại các phòng học, phòng thực hành với nhiều trang thiết bị máy tính, hệ thống mạng đầy đủ và hiện đại. Điều này, đã tạo nên một bước đột phá và làm thay đổi sâu sắc bộ mặt Khoa CNTT.",
    "Hệ thống phòng máy thực hành tọa lạc tại tòa nhà 4 tầng với diện tích gần 2.000m2 gồm các phòng nghiên cứu, phòng thực hành chuyên ngành, phòng máy chủ,...",
  ];

  readonly facilityHighlights = [
    "Các phòng máy tính thực hành đều được trang bị máy chiếu, máy lạnh, lắp đặt hệ thống Internet tốc độ cao đã đáp ứng tốt yêu cầu đào tạo cho các chuyên ngành Công nghệ phần mềm, Hệ thống thông tin, Khoa học máy tính, Mạng máy tính, Sư phạm Tin học và chuyên ngành kỹ sư Kỹ thuật phần mềm",
    "Hiện có 10 phòng máy tính thực hành với hơn 700 máy tính, 1 phòng máy chủ và 4 phòng nghiên cứu, cụ thể:",
    "- 03 phòng thực hành dành cho chuyên ngành Mạng máy tính.",
    "	- 02 phòng thực hành dành cho chuyên ngành Công nghệ phần mềm, kỹ sư Kỹ thuật phần mềm.",
    "- 02 phòng thực hành dành cho chuyên ngành Hệ thống thông tin.",
    "- 05 phòng thực hành đại cương dành cho sinh viên không thuộc chuyên ngành CNTT.",
    "- 01 phòng máy chủ và 04 phòng nghiên cứu dành cho các nhóm nghiên cứu về Xử lý ngôn ngữ tự nhiên, Xử lý dữ liệu lớn, Xử lý ảnh,...",
  ];

  readonly facilityGallery: FacilityImage[] = [
    { src: "/phong-thccnpm.jpg", alt: "Phong thuc hanh chuyen nganh Cong nghe phan mem", caption: "Phòng thực hành chuyên ngành Công nghệ phần mềm, Kỹ thuật phần mềm" },
    { src: "/phong-tjdc.jpg", alt: "Phong thuc hanh chuyen nganh He thong thong tin", caption: "Phòng thực hành chuyên ngành Hệ thống thông tin" },
    { src: "/phong-thmmt.jpg", alt: "Phong thuc hanh ve Mang may tinh", caption: "Phòng thực hành về Mạng máy tính" },
    { src: "/nhom-nghien-cuu-xu-ly-ngon-ngu.jpg", alt: "Nhom nghien cuu xu ly ngon ngu", caption: "Nhóm nghiên cứu về Xử lý ngôn ngữ tự nhiên" },
  ];

  readonly facultyPages = signal<FacultyPage[]>([
    {
      key: "mission",
      label: "Chức năng, nhiệm vụ",
      title: "CHỨC NĂNG, NHIỆM VỤ CỦA KHOA CNTT",
      summary: "Thông tin chức năng và nhiệm vụ của Khoa Công nghệ thông tin, Trường Đại học Quy Nhơn.",
      logoSrc: "/cnttlogo.png",
      paragraphs: [],
      highlights: [],
      sections: [
        { title: "Chức năng", body: "Khoa có chức năng xây dựng kế hoạch, tổ chức triển khai các hoạt động giáo dục đào tạo và nghiên cứu khoa học do khoa quản lý; xây dựng và phát triển đội ngũ giảng viên, quản lý, đánh giá viên chức và người học thuộc khoa quản lý theo sự phân cấp của Hiệu trưởng." },
        { title: "Nhiệm vụ" },
        { title: "1. Công tác giáo dục đào tạo", items: ["a) Xây dựng chương trình, kế hoạch đào tạo, tổ chức quá trình đào tạo, đánh giá và cập nhật chương trình đào tạo các trình độ đại học, thạc sĩ, tiến sĩ cho các ngành, chuyên ngành do khoa quản lý, các ngành liên quan và các hoạt động giáo dục đào tạo khác trong Nhà trường;", "b) Bồi dưỡng, cập nhật, nâng cao kiến thức, năng lực chuyên môn thông qua các hoạt động giáo dục thường xuyên nhằm đáp ứng nhu cầu xã hội và nhu cầu học tập suốt đời của người học;", "c) Xây dựng kế hoạch thực hành, thực tập, thực tế, thực nghiệm khoa học cho người học;", "d) Xây dựng kế hoạch mở ngành, chuyên ngành đào tạo; xây dựng kế hoạch bảo đảm chất lượng chương trình đào tạo;", "đ) Phối hợp với Phòng Khảo thí và Bảo đảm chất lượng, Phòng Đào tạo đại học và Phòng Đào tạo sau đại học trong việc tổ chức thi học phần, thi tốt nghiệp; phối hợp với Phòng Khảo thí và Bảo đảm chất lượng trong công tác đánh giá chất lượng giáo dục;", "e) Phối hợp với các khoa, phòng liên quan trong việc xây dựng kế hoạch và tổ chức triển khai đào tạo và cấp Chứng chỉ Giáo dục quốc phòng - an ninh, Chứng chỉ ngoại ngữ, Chứng chỉ công nghệ thông tin và các chứng chỉ khác cho người học;", "g) Quản lý, theo dõi người học theo Quy chế của Bộ Giáo dục và Đào tạo và quy định của Trường; thông báo kịp thời kết quả học tập cho sinh viên; phát hiện và bồi dưỡng nhân tài; phối hợp với phòng Công tác chính trị - Sinh viên tổ chức, triển khai các hoạt động liên quan đến người học, đánh giá kết quả rèn luyện của người học.", "h) Quản lý, theo dõi người học theo Quy chế của Bộ Giáo dục và Đào tạo và quy định của Trường; thông báo kịp thời kết quả học tập cho sinh viên; phát hiện và bồi dưỡng nhân tài; phối hợp với phòng Công tác chính trị - Sinh viên tổ chức, triển khai các hoạt động liên quan đến người học, đánh giá kết quả rèn luyện của người học."] },
        { title: "2. Công tác nghiên cứu khoa học", items: ["a) Xây dựng kế hoạch, tổ chức và triển khai các hoạt động khoa học và công nghệ; thực hiện các đề tài, dự án, chuyển giao công nghệ; tổ chức hội nghị, seminar và các sinh hoạt học thuật khác;", "b) Tổ chức biên soạn chương trình, giáo trình, tài liệu tham khảo; cải tiến phương pháp dạy học, nghiên cứu nhằm phục vụ công tác đào tạo và nghiên cứu khoa học;", "c) Quản lý nội dung, phương pháp, chất lượng hoạt động khoa học - công nghệ; thực hiện việc công bố công trình khoa học - công nghệ;", "d) Phối hợp với phòng Khoa học công nghệ và Hợp tác quốc tế tổ chức, triển khai công tác nghiên cứu khoa học trong giảng viên và sinh viên."] },
        { title: "3. Các công tác khác", items: ["a) Đề xuất các giải pháp xây dựng và phát triển khoa: về tổ chức, nhân sự; phát triển đội ngũ giảng viên, cơ sở vật chất và các điều kiện đảm bảo chất lượng đào tạo đáp ứng nhu cầu xã hội và hội nhập quốc tế;", "b) Xây dựng kế hoạch và tổ chức công tác giáo dục chính trị, tư tưởng, đạo đức, lối sống, đời sống tinh thần cho đội ngũ viên chức và người học thuộc khoa quản lý;", "c) Quản lý đội ngũ viên chức của khoa theo phân cấp; tổ chức đánh giá viên chức quản lý, giảng viên và nghiên cứu viên trong khoa; tham gia đánh giá viên chức quản lý cấp trên, viên chức quản lý ngang cấp theo quy định của Nhà trường;", "d) Xây dựng kế hoạch and quản lý công tác đào tạo, bồi dưỡng kiến thức chuyên môn, nghiệp vụ sư phạm cho giảng viên của khoa;", "đ) Thực hiện các hoạt động hợp tác và đối ngoại trong phạm vi chức năng và quyền hạn của khoa;", "e) Quản lý, sử dụng hiệu quả các tài sản, trang thiết bị và tài chính do Trường cung cấp;", "g) Thực hiện các nhiệm vụ khác theo sự phân công của Hiệu trưởng."] }
      ]
    },
    {
      key: "history",
      label: "Lịch sử, phát triển",
      title: "Lịch sử hình thành, mục tiêu và hướng phát triển",
      summary: "",
      metaLine: "17/04/2018",
      centerHeading: "Sơ lược về sự ra đời của Khoa",
      paragraphs: [
        "Năm thành lập khoa: 1999.",
        "Từ năm 1992, khoa Toán của trường Đại học Sư phạm Quy Nhơn (nay là trường Đại học Quy Nhơn) liên kết với Khoa Toán – Cơ – Tin học, trường Đại học Tổng hợp Hà Nội (nay là trường Đại học Khoa học Tự nhiên – Đại học Quốc gia Hà Nội) đào tạo cử nhân ngành Tin học và đây được xem là khởi đầu cho việc hình thành khoa Tin học hiện nay. Cùng từ đây, trường Đại học Quy Nhơn bắt đầu đào tạo cán bộ, chuẩn bị cơ sở vật chất nhằm đáp ứng cho việc đào tạo một ngành mới đó là ngành Tin học.",
        "Đến năm 1999 trên cơ sở một số cán bộ của Tổ Tin học và Toán ứng dụng thuộc khoa Toán đã tách ra và thành lập nên khoa Tin học.",
      ],
      highlights: [],
      sections: [
        {
          title: "* Các giai đoạn phát triển",
          items: [
            "Giai đoạn 1: Từ năm 1992 đến năm 1998",
            "Đây là giai đoạn Tin học là một bộ phận của khoa Toán, việc đào tạo các ngành Tin học, Toán tin ứng dụng liên kết với khoa Toán – Cơ – Tin học trường Đại học Khoa học Tự nhiên – Đại học Quốc gia Hà Nội. Là giai đoạn chuẩn bị đào tạo đội ngũ để hình thành nên khoa Tin học.",
            "Giai đoạn 2: Từ năm 1999 đến nay",
            "Từ năm 1999 khoa Tin học được chính thức thành lập với đội ngũ từ Tổ Tin học và Toán ứng dụng thuộc khoa Toán. Lúc này đội ngũ của Khoa chủ yếu là một số giáo viên thuộc khoa Toán học và được đào tạo thêm về Tin học, một số sinh viên Tin học giỏi sau khi tốt nghiệp được giữ lại Khoa.",
            "Cùng từ năm 1999, Khoa chính thức mở ngành đào tạo Tin học sau 7 khóa đào tạo liên kết với khoa Toán – Cơ – Tin học. Trong thời gian đầu, Khoa gặp nhiều khó khăn về nhân sự. Một mặt cán bộ của Khoa phải đảm nhiệm việc dạy Tin học đại cương cho tất cả các khoa trong trường, mặt khác phải chuẩn bị để đảm nhận các môn chuyên ngành của Khoa. Cán bộ của Khoa trong thời kỳ đầu vừa bổ sung từ các sinh viên giỏi sau khi tốt nghiệp, vừa phải đi học cao học và nghiên cứu sinh để nâng cao trình độ. Đa số cán bộ của Khoa là những cán bộ trẻ nên rất tích cực trong việc học tập, nâng cao trình độ. Các cán bộ của khoa đi học cao học và nghiên cứu sinh đều rất tích cực học tập đạt kết quả tốt.",
            "Cho đến nay, số cán bộ của Khoa là 27, trong đó có 9 TS, 17 ThS, 1 CN. Hiện có cán bộ đang học NCS.",
            "Sinh viên của Khoa sau khi ra trường hoạt động trong nhiều lĩnh vực khác nhau như: giảng dạy, quản lý hệ thống thông tin của các cơ quan,… trong phạm vi cả nước.",
            "Hiện nay, số sinh viên chính quy của Khoa khoảng hơn 1000 và gần 100 học viên cao học cùng nhiều sinh viên hệ vừa học vừa làm và văn bằng 2. Ngoài các lớp tại trường, Khoa còn có các lớp tại Quảng Ngãi, Đắk Lắk, Lâm Đồng. Tham gia chính trong đào tạo ngành Sư phạm Tin học (thuộc Khoa Sư phạm – Trường Đại học Quy Nhơn) nhằm đào tạo đội ngũ giáo viên Tin học cho các trường phổ thông.",
          ],
        },
        {
          title: "Mục tiêu và hướng phát triển của Khoa",
          items: [
            "- Tiếp tục xây dựng chương trình đào tạo các ngành đào tạo phù hợp với xu thế phát triển chung của CNTT Việt Nam như: Công nghệ phần mềm, Kỹ thuật máy tính, Mạng và Truyền thông.",
            "Nghiên cứu các giải pháp ứng dụng CNTT vào thực tế và triển khai các đề tài liên quan đến CNTT tại khu vực miền Trung và Tây Nguyên.",
            "- Tiếp tục xây dựng một đội ngũ cán bộ có trình độ cao về Công nghệ thông tin tiến tới đào tạo thạc sĩ, tiến sĩ về Công nghệ thông tin cho cán bộ khu vực miền Trung và Tây Nguyên.",
          ],
        },
      ],
    },
    {
      key: "vision",
      label: "Sứ mệnh, tầm nhìn",
      title: "Sứ mệnh, tầm nhìn",
      summary: "",
      logoSrc: "/su-menh-va-tam-nhin-cntt.jpg",
      mediaAlt: "Sứ mệnh và tầm nhìn Khoa Công nghệ thông tin",
      metaLine: "19/11/2019",
      paragraphs: [],
      highlights: [],
      sections: [
        {
          title: "SỨ MỆNH",
          body: "Khoa Công nghệ thông tin Trường Đại học Quy Nhơn là trung tâm đào tạo đại học, sau đại học, cung cấp nguồn nhân lực chất lượng cao đáp ứng yêu cầu phát triển kinh tế - xã hội đất nước, đặc biệt là đào tạo nguồn nhân lực cho khu vực miền Trung - Tây Nguyên. Khoa cũng là đơn vị quan trọng trong nghiên cứu khoa học, phát triển ứng dụng và chuyển giao công nghệ thuộc lĩnh vực công nghệ thông tin.",
        },
        {
          title: "TẦM NHÌN",
          body: "Đến năm 2030, Khoa Công nghệ thông tin Trường Đại học Quy Nhơn trở thành đơn vị đào tạo và nghiên cứu khoa học uy tín của cả nước, có vai trò nòng cốt trong đào tạo, nghiên cứu, và chuyển giao các sản phẩm đào tạo về Công nghệ thông tin của Trường Đại học Quy Nhơn.",
        },
      ],
    },
    {
      key: "strategy",
      label: "Chiến lược phát triển",
      title: "KẾ HOẠCH CHIẾN LƯỢC PHÁT TRIỂN KHOA CÔNG NGHỆ THÔNG TIN",
      summary: "",
      metaLine: "19/11/2019",
      centerHeading: "KẾ HOẠCH CHIẾN LƯỢC PHÁT TRIỂN KHOA CÔNG NGHỆ THÔNG TIN GIAI ĐỌAN 2025 - 2030",
      paragraphs: [],
      highlights: [],
      sections: [
        {
          title: "1. GIỚI THIỆU CHUNG",
          items: [
            "  Năm 1992, nhận thấy Tin học là một ngành đào tạo mà xã hội có nhu cầu, Trường Đại học Sư phạm Quy Nhơn (nay là Trường Đại học Quy Nhơn – ĐHQN) đã liên kết với Trường Đại học Tổng hợp Hà Nội (nay là Trường Đại học Khoa học Tự nhiên – Đại học Quốc gia Hà Nội) đào tạo cử nhân ngành Tin học, và đây được xem là khởi đầu cho việc hình thành khoa Công nghệ thông tin (CNTT) hiện nay. Với việc liên kết đào tạo này, Trường Đại học Sư phạm Quy Nhơn đã là nơi đào tạo ngành Tin học khá sớm của khu vực miền Trung và Tây Nguyên. Cũng từ đó, Trường Đại học Sư phạm Quy Nhơn bắt đầu đào tạo cán bộ, chuẩn bị cơ sở vật chất nhằm đáp ứng cho việc đào tạo một ngành mới đó là ngành Tin học.",
            "Với nhu cầu ngày càng tăng của nhân lực Tin học, sự gia tăng nhanh chóng về số lượng sinh viên theo học ngành Tin học cho thấy xu hướng phát triển và tầm quan trọng của lĩnh vực Tin học trong phát triển Khoa học công nghệ và Kinh tế xã hội của đất nước. Trên cơ sở đó, ngày 14 tháng 5 năm 1999, Bộ Giáo dục và Đào tạo đã ra Quyết định số 1649/QĐ-BGD&ĐT về việc thành lập Khoa Tin học, Trường Đại học Sư phạm Quy Nhơn. Lúc này, đội ngũ giảng viên của Khoa chủ yếu là các giảng viên từ tổ Toán ứng dụng thuộc khoa Toán được cử đi đào tạo về Tin học và một số sinh viên Tin học giỏi sau khi tốt nghiệp được giữ lại Khoa. Và cũng trong năm học 1999 – 2000, sau 7 năm liên kết đào tạo, Trường Đại học Sư phạm Quy Nhơn chính thức được đào tạo cử nhân ngành Tin học. Đây là bước ngoặt lớn có ý nghĩa tác động mạnh mẽ tới quá trình phát triển của Khoa sau này.",
            "Cùng với sự phát triển của Trường Đại học Quy Nhơn và sự phát triển nhanh chóng của CNTT, đến năm 2010, Khoa đổi tên thành Khoa CNTT nhằm định hướng đào tạo gắn với công nghệ và đáp ứng nhu cầu của xã hội.",
            "Đến nay, sau một thời gian xây dựng và phát triển, vượt qua những khó khăn ban đầu, Khoa CNTT đã dần khẳng định vị thế trong đào tạo nguồn nhân lực CNTT Việt Nam. Hiện nay, Khoa CNTT được biết đến như một đơn vị đào tạo năng động, đoàn kết, có chiến lược đào tạo và phát triển hướng tới tiêu chuẩn chất lượng và đáp ứng tốt nhu cầu của xã hội. Từ chỗ chỉ có một ngành đào tạo trình độ đại học, đến nay Khoa đã đào tạo thạc sĩ ngành Khoa học máy tính, 2 ngành đào tạo trình độ đại học là CNTT (với 4 chuyên ngành: Trí tuệ nhân tạo, Hệ thống thông tin, Công nghệ phần mềm, Mạng máy tính), Kỹ thuật phần mềm (hệ kỹ sư) và đã mở rộng thêm ngành Sư phạm Tin học của Khoa Sư phạm. Để đáp ứng nhu cầu của xã hội, ngoài việc đào tạo sinh viên chính quy, Khoa còn tham gia đào tạo theo hình thức vừa làm vừa học, liên thông, đào tạo tại chức trình độ cao đẳng lên đại học ngành CNTT. Khoa cũng tổ chức đào tạo tại các tỉnh miền Trung và Tây Nguyên như Bình Định, Phú Yên, Gia Lai, Kon Tum, Đắk Lắk, Lâm Đồng, góp ý phần quan trọng vào đào tạo nhân lực CNTT chọ các tỉnh trong khu vực và cả nước.",
            "Nhiều sinh viên của Khoa sau khi ra trường đã tiếp tục học tập nâng cao trình độ và đang tham gia giảng dạy trong các trường đại học, các viện nghiên cứu, đang giữ những vị trí quan trọng trong các cơ quan nhà nước, các công ty chuyên về CNTT, các tập đoàn đa quốc gia,... Nhiều cựu sinh viên đã quay lại giúp Khoa trong việc đào tạo các thế hệ sinh viên tiếp theo với kinh nghiệm làm việc thực tế của mình.",
            "Hiện nay, Khoa đã xây dựng được một đội ngũ gồm 27 cán bộ, giảng viên trong đó có 9 tiến sĩ, 4 nghiên cứu sinh, 14 thạc sĩ. Nhiều giảng viên của Khoa được đào tạo tại các nước có nền CNTT phát triển mạnh như Pháp, Đài Loan, Rumani,… Khoa CNTT được tổ chức thành 3 bộ môn là Bộ môn Mạng và Khoa học máy tính, Bộ môn Hệ thống thông tin, Bộ môn Công nghệ phần mềm.",
            "Trong những năm qua, Khoa CNTT đã đào tạo được hơn 4000 sinh viên, học viên. Hằng năm, Khoa tuyển sinh hơn 300 sinh viên đại học, học viên cao học. Những sinh viên của Khoa sau khi tốt nghiệp đã góp phần đáp ứng được nhu cầu nhân lực ngày càng cao của ngành CNTT trong khu vực cũng như trên cả nước. Bên cạnh đó, tập thể cán bộ và giảng viên của Khoa đã tham gia giảng dạy bộ môn Tin học cho hàng chục ngàn sinh viên của Trường, tham gia bồi dưỡng học sinh giỏi tin học cho các học sinh chuyên Tin học của tỉnh Bình Định, Phú Yên và đạt nhiều thành tích cao. Song song với việc đào tạo, đội ngũ cán bộ của Khoa còn tích cực tham gia nghiên cứu khoa học, đã tham gia chủ trì 6 đề tài cấp Bộ và tương đương, công bố trên 100 bài báo khoa học trên các tạp chí chuyên ngành, tham gia phản biện, đánh giá nhiều đề tài, dự án khoa học công nghệ cho tỉnh Bình Định. Ngoài ra, để nâng cao chất lượng đào tạo và bắt kịp với tốc độ phát triển nhanh chóng của khoa học công nghệ, Khoa đã xây dựng một chương trình đào tạo linh hoạt, cập nhật, kết hợp giữa kiến thức cơ bản với các nội dung hiện đại, các công nghệ mới trong lĩnh vực CNTT, định hướng chuyên sâu, nhằm đào tạo được nguồn nhân lực CNTT có chất lượng, phù hợp với xu thế phát triển công nghệ trong khu vực và thế giới.",
            "Trong bối cảnh cuộc cách mạng công nghiệp lần thứ 4 (CMCN 4.0) đang hình thành và phát triển, nhu cầu nhân lực về CNTT rất lớn. Đây vừa là thời cơ vừa là thách thức đối với Khoa. Nắm bắt được cơ hội đó, Khoa CNTT nhanh chóng cập nhật, đổi mới chương trình đào tạo, liên kết, hợp tác với các công ty sản xuất và nghiên cứu về công nghệ thông tin trong nước, các đơn vị sử dụng lao động CNTT để phối hợp đào tạo, định hướng nghề nghiệp cho sinh viên. Trong năm 2017, được sự đồng ý của Trường, Khoa đã đề xuất Trường ký kết thỏa thuận hợp tác với các công ty FPT Software Đà Nẵng, GameLoft Đà Nẵng, TMA Solutions - Tp. Hồ Chí Minh, Fujinet. Trong năm 2020 Khoa tiếp tục mở rộng sự hợp tác với doanh nghiệp cụ thể hóa bằng những MoU mới với các đối tác cũ, thêm những điều khỏa mang lại giá trị cho hai bên và ký kết với các công ty, doanh nghiệp mới để tận dụng được nguồn lực phát huy được thế mạnh của các bên liên quan. Sự hợp tác này sẽ hứa hẹn nhiều đổi mới trong công tác giảng dạy, tạo ra những giá trị mới và cùng nhau chia sẻ những giá trị đó. Việc ký kết biên bản ghi nhớ này không chỉ mở đầu quan hệ hợp tác, mà còn là sự chia sẻ tầm nhìn công nghệ, sự hỗ trợ trong đào tạo và sử dụng nguồn nhân lực. Khoa CNTT kỳ vọng vào những bước đi mang tính thực tiễn này nhằm tìm kiếm giải pháp, định hướng đào tạo mang lại hiệu quả cao nhất.",
            "Nghiên cứu Chiến lược phát triển Khoa Công nghệ thông tin - Trường Đại học Quy Nhơn đến năm 2024 và tầm nhìn 2030 góp phần định hướng phát triển bền vững nhà trường trong thời gian tới.",
          ],
        },
        {
          title: "	2. PHÂN TÍCH DỰ BÁO PHÁT TRIỂN MÔI TRƯỜNG KINH TẾ - XÃ HỘI VÀ ĐÁNH GIÁ THỰC TRẠNG KHOA CÔNG NGHỆ THÔNG TIN",
        },
        {
          title: "	2.1. Bối cảnh quốc tế và khu vực",
          items: [
            "Toàn cầu hóa và sự phát triển của khoa học và công nghệ, đặc biệt là sự bùng nổ những xu thế mới trong lĩnh vực công nghệ thông tin đã đặt thế giới trước những biến đổi vô cùng to lớn. Trong lĩnh vực giáo dục ảnh hưởng này đã và sẽ làm thay đổi căn bản phương pháp giảng dạy cũng như điều kiện tiếp cận kiến thức của người học.",
            "Toàn cầu hóa về kinh tế đang dẫn tới quá trình toàn cầu hóa rộng rãi và sâu sắc trong giáo dục và đào tạo. Xu hướng cạnh tranh, hợp tác và liên kết trên phạm vi toàn cầu trong giáo dục đào tạo đã trở thành một trào lưu mạnh mẽ chi phối tất cả các cơ sở đào tạo. Trong xu thế này các tập đoàn giáo dục đào tạo xuyên quốc gia sẽ hình thành, điều này tác động mạnh và trực tiếp đến hệ thống giáo dục của mỗi quốc gia riêng rẽ; những cơ sở đào tạo có chất lượng cao, tạo ra sự khác biệt trong sản phẩm đào tạo sẽ tồn tại và phát triển bền vững; những cơ sở đào tạo không có hiệu quả thực sự sẽ bị thôn tính hoặc tự loại mình ra khỏi tiến trình phát triển.",
            "Toàn cầu hóa kinh tế trong bối cảnh phát triển như vũ bão của khoa học và công nghệ, đặc biệt là công nghệ thông tin và truyền thông đã dẫn đến những thay đổi bản chất của nền kinh tế thế giới. Kinh tế tri thức đã trở thành tiêu chí, thước đo đánh giá quá trình công nghiệp hóa, hiện đại hóa; đánh giá trình độ phát triển và văn minh của mỗi quốc gia.",
            "	Điều này đã làm cho phát triển giáo dục và đào tạo trở thành động lực phát triển quan trọng nhất của  nền kinh tế và xã hội hiện đại. Kinh tế tri thức dẫn tới sự bùng nổ nhu cầu học tập trong xã hội, đó là nền tảng nâng cao chất lượng đào tạo và phát triển giáo dục theo chiều sâu.",
          ],
        },
        {
          title: "2.2. Bối cảnh trong nước",
          items: [
            "Là thành viên chính thức của WTO, Việt Nam đang thực sự hội nhập vào thị trường toàn cầu. Hội nhập quốc tế đưa đất nước phát triển trong môi trường rộng lớn hơn, với những định chế toàn cầu, cạnh tranh và hợp tác, nhiều biến động, đồng thời có nhiều cơ hội hơn để tăng cường quan hệ quốc tế, gắn kết hiệu quả hơn với nền kinh tế thế giới. Hội nhập đã đặt phát triển nguồn nhân lực trở thành một trong những mục tiêu kinh tế - xã hội quan trọng và mục tiêu chiến lược của phát triển bền vững đất nước. ",
            "Thách thức chung và cơ bản nhất trong phát triển nguồn nhân lực đáp ứng yêu cầu hội nhập quốc tế là nguồn nhân lực nước ta chưa đủ năng lực cạnh tranh trên thị trường quốc tế và cả trên thị trường trong nước nếu có yếu tố nước ngoài tham gia. Thời cơ chung và cơ bản nhất của phát triển nguồn nhân lực trong hội nhập quốc tế là môi trường hợp tác rộng mở, năng động và tiềm tàng những yếu tố hiện đại để cọ xát và trực tiếp học hỏi. Hội nhập kinh tế quốc tế sau WTO đặt Việt Nam vào sự phát triển toàn cầu với nhiều cơ hội cũng như thách thức đòi hỏi các trường đại học Việt Nam cần năng động, nhạy bén hơn trước những biến động quốc tế.",
            "Quá trình công nghiệp hóa, hiện đại hóa đất nước đang diễn ra hết sức mạnh mẽ. Công nghiệp hóa, hiện đại hóa vừa phải bảo đảm nhanh chóng đưa nước ta thoát khỏi nghèo nàn lạc hậu vừa phải rút ngắn khoảng cách tụt hậu với các nước, bảo đảm sự phát triển bền vững. Điều này thúc đẩy giáo dục đào tạo phải phát triển với tốc độ nhanh hơn, việc chuyển biến cơ cấu đào tạo phải diễn ra mạnh mẽ và linh hoạt hơn. ",
            "Nghị quyết 14/2005 ngày 2 tháng 11 năm 2005 của Chính phủ về đổi mới cơ bản và toàn diện Giáo dục đại học Việt Nam đặt ra mục tiêu cụ thể là hoàn thiện chính sách phát triển theo hướng đảm bảo quyền tự chủ và trách nhiệm xã hội của cơ sở giáo dục đại học, sự quản lý của Nhà nước và vai trò giám sát, đánh giá của xã hội đối với giáo dục đại học.",
            "Trong bối cảnh mới, hợp tác, chia sẻ và hiệu quả là trách nhiệm sống còn của giáo dục đại học nói chung và đối với Khoa Công nghệ thông tin nói riêng.",
          ],
        },
        {
          title: "2.3. Thực trạng của Khoa",
        },
        {
          title: "2.3.1. Tình hình tổ chức, quản lý đào tạo",
          items: [
            "Chương trình đào tạo",
            "Năm 2010, Khoa đã xây dựng lại toàn bộ chương trình đào tạo của tất cả các ngành để chuyển sang đào tạo theo hệ thống tín chỉ. Hội đồng khoa học và đào tạo của các khoa đã rà soát, thay đổi nội dung chương trình, thời lượng, hình thức giảng dạy, cách kiểm tra đánh giá kết quả học tập các môn học so với chương trình đào tạo theo niên chế trước đây. Chương trình đào tạo của được cập nhật theo hướng thời sự, hiện đại. Nhiều nội dung mới để phù hợp với sự phát triển của khoa học công nghệ; tăng thời lượng, bổ sung nội dung đào tạo kỹ năng thực hành.",
            "Giảng viên và phương pháp giảng dạy",
            "Nhà trường cũng đã tổ chức cho giảng viên biên soạn đề cương chi tiết cho tất cả môn học và biên soạn bài giảng cho một nhiều môn học của chương trình đào tạo. Chương trình đào tạo của các ngành được đăng tải trên website. Sinh viên có thể chủ động xây dựng kế hoạch học tập từ các chương trình đào tạo trong các tài liệu.",
            "	Trong những năm vừa qua, Khoa đã có nhiều cố gắng đổi mới nội dung chương trình đào tạo, tổ chức nghiên cứu phát triển chương trình đào tạo. Tuy nhiên, sự thay đổi này vẫn chưa đáp ứng kịp với đòi hỏi đổi mới trong giai đoạn hiện nay. ",
            "Giảng viên và phương pháp giảng dạy",
            "Về giảng viên:  Đây là yếu tố quan trọng quyết định chất lượng đào tạo và uy tín của Khoa. Đa số giảng viên có trình độ chuyên môn tốt, có năng lực nghiên cứu khoa học, tâm huyết với nghề, sáng tạo trong giảng dạy. Nhiều giảng viên trẻ có trình độ chuyên môn tốt, ngay sau khi được tuyển dụng vào trường đã chủ động xin học bổng để đi học thạc sĩ, tiến sĩ ở nước ngoài. ",
            "Tuy nhiên, đội ngũ giảng viên vẫn còn một số hạn chế: trình độ ngoại ngữ, năng lực nghiên cứu khoa học và khả năng hợp tác trong chuyên môn còn hạn chế. Số đề tài nghiên cứu khoa học cấp Bộ, cấp Nhà nước của giảng viên còn ít.",
            "Về phương pháp giảng dạy: Chuyển sang đào tạo theo hệ thống tín chỉ, số giờ lên lớp không nhiều như trước, bắt buộc giảng viên phải đổi mới phương pháp giảng dạy. Khi biên soạn đề cương chi tiết, biên soạn bài giảng giảng viên đã thiết kế, tổ chức, cơ cấu lại nội dung; các yêu cầu, tài liệu tham khảo, cách hướng dẫn sinh viên tự học, củng cố kiến thức. Việc sử dụng công nghệ thông tin hỗ trợ giảng dạy nhiều hơn, hiệu quả hơn. Tổ chức các hoạt động nhóm trong giờ lên lớp chỉ thực hiện ở một số học phần. Tuy nhiên việc đổi mới phương pháp giảng dạy là chưa thực sự rõ nét. ",
          ],
        },
        {
          title: "2.3.2. Về hoạt động khoa học và công nghệ",
          items: [
            "Trong những năm gần đây đã có một số đề tài được tài trợ thực hiện bởi ngân sách của Trường và Quỹ phát triển khoa học và công nghệ quốc gia (Nafosted) với kết quả được đánh giá tốt. ",
            "Các đề tài cấp Bộ và cấp cơ sở được triển khai đúng tiến độ. Ngoài ra cán bộ giảng viên Nhà trường còn tham gia các đề tài cấp Tỉnh và thực hiện các hợp đồng với các đối tác bên ngoài.",
            "Hoạt động nghiên cứu khoa học trong sinh viên đã trở thành một trong những nhân tố thực sự góp phần nâng cao chất lượng đào tạo của Nhà trường. Hằng năm nhà trường tổ chức Hội nghị tổng kết công tác nghiên cứu khoa học sinh viên, tạo điều kiện để cho những sinh viên thực hiện đề tài có kết quả tốt được báo cáo trước đông đảo cán bộ, giảng viên và sinh viên nhằm động viên và khích lệ tinh thần đam mê nghiên cứu khoa học của sinh viên.",
          ],
        },
        {
          title: "3. SỨ MỆNH – TẦM NHÌN VÀ MỤC TIÊU PHÁT TRIỂN",
        },
        {
          title: "3.1. Sứ mệnh ",
          body: "Khoa Công nghệ thông tin Trường ĐHQN là đơn vị đào tạo đại học, sau đại học, cung cấp nguồn nhân lực trong lĩnh vực công nghệ thông tin chất lượng cao đáp ứng yêu cầu phát triển kinh tế - xã hội đất nước, đặc biệt là đào tạo nguồn nhân lực cho khu vực miền Trung- Tây Nguyên. Khoa cũng là đơn vị quan trọng trong nghiên cứu khoa học, phát triển ứng dụng và chuyển giao công nghệ thuộc lĩnh vực công nghệ thông tin.",
        },
        {
          title: "3.2. Tầm nhìn",
          body: "Đến năm 2030, Khoa Công nghệ thông tin Trường ĐHQN trở thành đơn vị đào tạo và nghiên cứu khoa học uy tín của cả nước, có vai trò nòng cốt trong đào tạo, nghiên cứu, và chuyển giao các sản phẩm đào tạo về CNTT của Trường ĐHQN.",
        },
        {
          title: "3.3. Hệ thống giá trị cơ bản",
          items: [
            "- Lấy người học làm trung tâm, hệ thống đào tạo and nghiên cứu khoa học được kiểm định and đảm bảo chất lượng theo chuẩn quốc gia.",
            "- Tôn trọng tài năng and cá tính sáng tạo trong nghề nghiệp của mọi người.",
            "- Chịu trách nhiệm cao trước nhà nước and cộng đồng xã hội.",
          ],
        },
        {
          title: "3.4. Triết lý giáo dục",
          body: 'Theo triết lý chung của Trường: “Toàn diện – Khai phóng – Thực nghiệp”.',
        },
        {
          title: "4. CHIẾN LƯỢC PHÁT TRIỂN VÀ GIẢI PHÁP THỰC HIỆN",
        },
        {
          title: "4.1. Về phát triển đội ngũ cán bộ",
        },
        {
          title: "4.1.1. Chiến lược phát triển đội ngũ cán bộ",
          items: [
            "Trong giai đoạn 2025 - 2030 phát triển đội ngũ được xác định là chiến lược trung tâm, là nhân tố quyết định giữ vững quy mô and nâng cao chất lượng đào tạo. Đội ngũ cán bộ, giảng viên, viên chức  phải đạt các tiêu chuẩn cơ bản sau:",
            "- Có trình độ chuyên môn giỏi, có năng lực sáng tạo, tư duy đổi mới;",
            "- Có đạo đức tốt, sức khỏe tốt;",
            "- Có ý thức tự chủ, tự chịu trách nhiệm trước công việc;",
            "- Yêu nghề, gắn bó với Trường.",
            "Xây dựng đội ngũ cán bộ, giảng viên của Khoa ngày càng lớn mạnh đạt chất lượng cao, số lượng and cơ cấu hợp lý; chú trọng vào nâng cao năng lực công tác, bản lĩnh chính trị, phẩm chất đạo đức and lương tâm nghề nghiệp. Cụ thể:",
            "Quy hoạch phát triển đội ngũ cán bộ, giảng viên đủ về số lượng, mạnh về chất lượng, đủ phẩm chất and năng lực hoàn thành tốt nhiệm vụ trong công cuộc đổi mới của ngành Giáo dục and Đào tạo, nâng cao and đảm bảo chất lượng giáo dục and đào tạo về nhân lực công nghệ thông tin cho nhu cầu xã hội",
            "Xây dựng đội ngũ giảng viên chuẩn hóa về chức danh, trình độ theo quy định của Bộ Giáo dục and Đào tạo, phấn đấu đến năm 2030 có giảng viên đạt chức danh Phó Giáo sư and trên 35% cán bộ giảng dạy đạt trình độ tiến sĩ",
            "	Xây dựng đội ngũ cán bộ quản lý có bản lĩnh chính trị vững vàng, có năng lực quản lý tốt, có tinh thần trách nhiệm cao, năng động, sáng tạo trong công việc, có uy tín and tập hợp được cán bộ, viên chức chung sức thực hiện nhiệm vụ chung.",
          ],
        },
        {
          title: "4.1.2. Giải pháp thực hiện",
          items: [
            "Nhanh chóng bồi dưỡng đội ngũ cán bộ lãnh đạo, quản lý các cấp có tư duy chiến lược and nhạy bén với sự phát triển của thời kỳ mới. Trong quy hoạch cán bộ cần tìm kiếm, phát hiện những nhân tố mới, đó là những người có lòng nhiệt huyết, có tầm nhìn. Cần nhanh chóng đưa những cán bộ trẻ khoảng 30-40 tuổi vào hàng ngũ lãnh đạo khoa.",
            "- Tuyển dụng, tăng cường đội ngũ giảng viên đảm bảo tỉ lệ sinh viên chính quy/giáo viên and giữ ổn định tỉ lệ này vào những năm tiếp theo.  ",
            "- Đào tạo and bồi dưỡng đội ngũ giảng viên đạt chuẩn. ",
            "- Đào tạo theo nhóm: Gửi tập trung một nhóm nhỏ cán bộ đến từng phòng thí nghiệm, trung tâm nghiên cứu ở nước ngoài để được đào tạo một hướng chuyên sâu.",
            "- Tạo điều kiện cho giảng viên trẻ được bồi dưỡng ngoại ngữ đạt yêu cầu tham gia dự tuyển các chương trình đào tạo cán bộ ở nước ngoài hoặc đăng ký xin các học bổng quốc tế. ",
            "- Đa dạng hóa các điểm đến học tập của cán bộ trẻ. Việc tiếp nhận các nền văn hóa đa dạng cũng như phương pháp nghiên cứu khoa học, giảng dạy của các nước khác nhau rất cần thiết để phát triển nhà trường. Vì vậy cần khuyến khích cán bộ trẻ đi học tập ở nhiều nước and vùng lãnh thổ khác nhau.",
            "- Đánh giá đúng thực trạng đội ngũ cán bộ, công chức, viên chức hiện có về tư tưởng, đạo đức, phẩm chất chính trị, năng lực chuyên môn, hiệu quả công tác. Sắp xếp lại những cán bộ, viên chức không đáp ứng yêu cầu công việc bằng cách: đào tạo lại, bồi dưỡng nâng cao trình độ, bố trí công việc phù hợp,...",
            "- Tiến hành xây dựng quy hoạch đội ngũ cán bộ, công chức, viên chức từ nay đến năm 2030, trên cơ sở đó xây dựng kế hoạch đào tạo and bồi dưỡng đội ngũ cán bộ, công chức, viên chức. Khuyến khích and tạo điều kiện cho cán bộ được đào tạo, bồi dưỡng nâng cao trình độ chuyên môn, nghiệp vụ đúng với chuyên ngành, công việc đảm nhận. Chú trọng đào tạo, bồi dưỡng đội ngũ cán bộ, công chức, viên chức một cách toàn diện về chuyên môn, chính trị, ngoại ngữ, tin học, … đảm bảo cho cán bộ sẵn sàng nhận and hoàn thành nhiệm vụ được giao. Đào tạo cán bộ gắn với sử dụng and đãi ngộ cán bộ. Tăng cường nguồn lực cho công tác đào tạo, bồi dưỡng cán bộ.",
            "- Tăng cường quản lý and sử dụng có hiệu quả đội ngũ cán bộ, công chức, viên chức theo hướng nâng cao ý thức trách nhiệm, tính kỷ luật lao động, sử dụng đúng người, đúng việc. ",
            "- Thực hiện có hiệu quả việc đánh giá cán bộ, công chức. Chủ động đào thải cán bộ, công chức, viên chức không đủ tiêu chuẩn and không đáp ứng được yêu cầu công việc.",
            "Giải pháp cụ thể đối với giảng viên",
            "- Đánh giá đội ngũ giảng viên hiện có về trình độ chuyên môn, cơ cấu ngành nghề, cơ cấu độ tuổi, … trên cơ sở đó có kế hoạch đào tạo, bồi dưỡng, sắp xếp, chuẩn hóa theo hướng bền vững. Có cơ chế chính sách khuyến khích, đãi ngộ để nhanh chóng hình thành đội ngũ các nhà khoa học có trình độ chuyên môn cao.",
            "- Thực hiện việc giao chỉ tiêu, kế hoạch tuyển giảng viên mới. Trên cơ sở chỉ tiêu được giao, Khoa lập kế hoạch cụ thể để Trường duyệt and chỉ đạo việc tuyển dụng giảng viên đảm bảo số lượng and chất lượng.",
            "- Thực hiện việc tạo nguồn giảng viên từ các sinh viên tốt nghiệp loại giỏi của Trường and khuyến khích tiếp nhận các ứng viên được tốt nghiệp loại giỏi tại các trường khác, ưu tiên tiếp nhận các ứng viên tốt nghiệp ở nước ngoài. Tích cực gửi các giảng viên đi đào tạo, nâng cao trình độ ở các nước tiên tiến. Xây dựng cơ chế chính sách đãi ngộ thỏa đáng để tập hợp, trọng dụng and thu hút tri thức giỏi từ mọi nơi về làm việc tại Khoa. Có chính sách quan tâm bồi dưỡng, ưu đãi đội ngũ hiện có and chủ động xây dựng phát triển đội ngũ kế cận.",
            "- Xây dựng and thực hiện đề án phát triển đội ngũ cán bộ giảng dạy trẻ. Khuyến khích and tạo điều kiện thuận lợi cho giảng viên trẻ sớm học tập, bồi dưỡng and nâng cao trình độ trong nước and ngoài nước. Có chính sách giúp đỡ các giảng viên trẻ nhanh chóng trưởng thành. Gắn nhiệm vụ giảng dạy, nghiên cứu khoa học and yêu cầu bồi dưỡng cán bộ, giảng viên.",
            "- Tiến hành rà soát, đánh giá lại đội ngũ chuyên viên hiện nay, trên cơ sở đó bố trí, sắp xếp lại công việc một cách phù hợp. Thay thế dần các chuyên viên có trình độ chuyên môn, nghiệp vụ thấp, không đáp ứng yêu cầu công việc bằng các chuyên viên viên mới trên cơ sở tuyển chọn kỹ càng.",
            "- Cụ thể hóa nhiệm vụ của các chuyên viên, nhân viên, gắn quyền lợi, trách nhiệm and khả năng thực hiện, nhiệm vụ của từng cá nhân",
            "- Xây dựng kế hoạch đào tạo, bồi dưỡng chuyên viên một cách phù hợp để nâng cao trình độ, năng lực công tác, tính chuyên nghiệp, kỷ luật lao động, ý thức trách nhiệm để có khả năng tham mưu, tác nghiệp, tổ chức and thực hiện tốt nhiệm vụ được giao.",
          ],
        },
        {
          title: "4.2. Về đào tạo đại học chính quy",
        },
        {
          title: "4.2.1. Chiến lược phát triển đào tạo",
          items: [
            "Đổi mới chương trình đào tạo and phương pháp giảng dạy: Mục tiêu and nội dung chương trình đào tạo phải được đổi mới theo hướng hiện đại, tiếp cận với trình độ tiên tiến trong khu vực đồng thời coi trọng kỹ năng làm việc thực tế, thích ứng với nhu cầu nguồn nhân lực cho sự nghiệp phát triển kinh tế, xã hội của địa phương and của đất nước.",
            "Tăng cường năng lực chuyên môn, năng lực nghiên cứu cho đội ngũ giảng viên: Xây dựng đội ngũ giảng viên có trình độ chuyên môn cao. Tạo điều kiện thuận lợi để giảng viên đi học nâng cao trình độ. Phấn đấu đến năm 2030, số giảng viên có trình độ tiến sĩ đạt (35-50)%.",
            "Tăng cường năng lực quản lý, tổ chức đào tạo: Nâng cao năng lực quản lý, tổ chức đào tạo cho cán bộ quản lý, cán bộ phục vụ đào tạo. Cán bộ quản lý and phục vụ đào tạo phải nắm vững quy chế, quy định and quy trình đào tạo...",
          ],
        },
        {
          title: "4.2.2. Giải pháp thực hiện",
          items: [
            "- Thiết kế chương trình có tính mở, mềm dẻo, thuận tiện cho việc chuyển đổi kiến thức, liên thông, học hai chương trình tạo điều kiện cho người học có thể thay đổi, cập nhật tri thức cần thiết để thích ứng với những yêu cầu của thị trường lao động. ",
            "- Xây dựng chuẩn đầu ra bám sát mục tiêu, chi tiết and khoa học. Chương trình đào tạo phải được thiết kế để sinh viên tốt nghiệp đạt được chuẩn đầu ra. Chú trọng đào tạo ngoại ngữ, tin học and các kỹ năng mềm",
            "- Khuyến khích giảng viên giảng dạy một số môn bằng tiếng Anh để tạo môi trường năng động hơn trong tự học and hội nhập quốc tế. Tiến tới liên kết đào tạo một vài ngành với các trường đại học nước ngoài để tăng cường quan hệ hợp tác quốc tế, trao đổi kinh nghiệm đào tạo.",
            "- Sử dụng tối ưu các phương tiện kỹ thuật hiện đại, ứng dụng hiệu quả công nghệ thông tin vào giảng dạy.",
            "- Nghiên cứu tiếp nhận and vận dụng những phương pháp giảng dạy, phương pháp đào tạo hiện đại đã được áp dụng thành công ở các nước.",
            "- Tăng cường hợp tác nghiên cứu với các trường đại học, học viện trong, ngoài nước. Chú trọng đào tạo bồi dưỡng lực lượng giảng viên trẻ, giảng viên cho các chuyên ngành còn thiếu.",
            "- Khuyến khích giảng viên đăng ký, tham gia các đề tài nghiên cứu khoa học công nghệ cấp Bộ, cấp Nhà nước.",
            "- Khảo sát, đánh giá chất lượng đầu ra, thông tin phản hồi của sinh viên, đánh giá của xã hội đối với sản phẩm đào tạo của Nhà trường để điều chỉnh, bổ sung chương trình đào tạo.",
            "- Chú trọng công tác bồi dưỡng kiến thức quản lý, chuyên môn nghiệp vụ  cho cán bộ quản lý and phục vụ đào tạo.",
          ],
        },
        {
          title: "4.3. Về nghiên cứu khoa học",
        },
        {
          title: "4.3.1. Chiến lược phát triển NCKH",
          items: [
            "Nâng cao năng lực nghiên cứu khoa học theo hướng chuyên sâu and đẩy mạnh công tác chuyển giao công nghệ theo yêu cầu xã hội nhằm đáp ứng yêu cầu nâng cao chất lượng đào tạo.",
            "Nâng cao năng lực nghiên cứu khoa học theo hướng chuyên sâu and đẩy mạnh công tác chuyển giao công nghệ theo yêu cầu xã hội nhằm đáp ứng yêu cầu nâng cao chất lượng đào tạo.",
            "- Phát triển mối quan hệ giữa Khoa, Trường and các tổ chức kinh tế - xã hội cũng như các đơn vị khác thông qua hoạt động hợp tác nghiên cứu;",
            "- Chuyển giao các kết quả NCKH cho các tổ chức, doanh nghiệp;",
            "- Góp phần đổi mới chương trình đào tạo dựa trên những kết quả NCKH trong and ngoài nước;",
            "- Thu hút các nguồn lực xã hội cho công tác NCKH",
          ],
        },
        {
          title: "4.3.2. Giải pháp thực hiện",
          items: [
            "- Xây dựng Quy chế hoạt động của Khoa; có các cơ chế đánh giá để ghi nhận thành tích về nghiên cứu khoa học and có các biện pháp khuyến khích về vật chất and tinh thần cho các giảng viên, học viên and sinh viên NCKH.",
            "- Hợp tác với các viện nghiên cứu, trường đại học trong nước and quốc tế để tạo sức mạnh trong các hoạt động NCKH. Thông qua các hoạt động hợp tác, các dự án, các hợp đồng nghiên cứu tìm nguồn kinh phí đầu tư.",
            "- Gắn kết hoạt động KHCN với các khoa and bộ môn khác, tạo mối liên hệ chặt chẽ giữa đào tạo and nghiên cứu, triển khai ứng dụng",
            "- Tổ chức các hội nghị, hội thảo về công nghệ thông tin với sự tham gia của các chuyên gia đầu ngành, các chuyên gia nước ngoài.",
          ],
        },
      ],
    },
    {
      key: "staff",
      label: "Danh sách nhân sự, phân công nhiệm vụ",
      title: "DANH SÁCH CÁN BỘ KHOA CÔNG NGHỆ THÔNG TIN",
      summary: "",
      metaLine: "03/03/2026",
      pdfSrc: "/cntt-thong-tin-can-bo-thien.pdf",
      paragraphs: [],
      highlights: []
    },
    {
      key: "structure",
      label: "Cơ cấu tổ chức",
      title: "Cơ cấu tổ chức khoa Công nghệ thông tin",
      summary: "",
      logoSrc: "/co-cau-to-chuc-khoa-cntt.png",
      mediaAlt: "Co cau to chuc Khoa Cong nghe thong tin",
      metaLine: "20/04/2020",
      centerHeading: "CƠ CẤU TỔ CHỨC KHOA CÔNG NGHỆ THÔNG TIN",
      paragraphs: [],
      highlights: []
    },
    {
      key: "facilities",
      label: "Cơ sở vật chất",
      title: "CƠ SỞ VẬT CHẤT",
      summary: "",
      logoSrc: "/csvc-kcntt-1.jpg",
      mediaAlt: "Toa nha 4 tang Truong Dai hoc Quy Nhon",
      metaLine: "16/05/2019",
      paragraphs: [],
      highlights: []
    }
  ]);

  protected currentFacultyPage(): FacultyPage {
    return this.facultyPages().find(p => p.key === this.selectedPageKey) ?? this.facultyPages()[0];
  }

  protected currentFacultyPdfResourceUrl(): SafeResourceUrl | null {
    const pdfSrc = this.currentFacultyPage().pdfSrc;
    return pdfSrc ? this.sanitizer.bypassSecurityTrustResourceUrl(pdfSrc) : null;
  }

  protected isDocumentStylePage(): boolean {
    return ["mission", "history", "vision", "strategy", "staff", "facilities"].includes(this.selectedPageKey);
  }

  protected isStructurePage(): boolean {
    return this.selectedPageKey === 'structure';
  }

  protected isFacilitiesPage(): boolean {
    return this.selectedPageKey === 'facilities';
  }
}
