export default class RiwayatView {
  async render() {
    const data = Array(6).fill({
      tanggal: "25/05/25",
      berat: "30 kg",
      tinggi: "148 cm",
      umur: "18 Tahun",
      kategori: "Berat badan kurang",
    });

    return `
        <div id="main-content" class="bg-[#F4FFEF] min-h-screen pt-24 pb-10 px-4 transition-all duration-300 ease-in-out">
            <div class="bg-[#ffffff] p-4 m-4">
                <p class="text-2xl font-bold">Riwayat</p>
            </div>
              <section class="p-4 m-4 bg-[#ffffff]">
              <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse">
                  <thead class="bg-green-600 text-white">
                    <tr>
                      <th class="p-2 text-left">Tanggal</th>
                      <th class="p-2 text-left">Berat</th>
                      <th class="p-2 text-left">Tinggi</th>
                      <th class="p-2 text-left">Umur</th>
                      <th class="p-2 text-left">Category</th>
                      <th class="p-2 text-left">Detail</th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-700">
                    ${data
                      .map(
                        (row) => `
                      <tr class="border-b">
                        <td class="p-2">${row.tanggal}</td>
                        <td class="p-2">${row.berat}</td>
                        <td class="p-2">${row.tinggi}</td>
                        <td class="p-2">${row.umur}</td>
                        <td class="p-2">${row.kategori}</td>
                        <td class="p-2 flex gap-2">
                          <button class="text-green-600 hover:underline">👁️</button>
                          <button class="text-green-600 hover:underline">⏻</button>
                        </td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            </div>
            </section>
        </div>
      `;
  }

  async afterRender() {
    // Event listeners bisa ditambahkan di sini
  }
}
