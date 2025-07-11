const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require("uuid");
const prisma = require("../prisma");
const qrcode = require('qrcode');

exports.AddKelompok = async (req, res) => {
    try {
        const { nomor } = req.body;

        const check = await prisma.Kelompok.findFirst({
            where: {
                nomor
            }
        })

        if (check) {
            return res.status(400).json({
                status: 400,
                message: `Kelompok ${nomor} sudah ada`,
            })
        }

        const data = await prisma.Kelompok.create({
            data: {
                nomor
            }
        })

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil menambahkan kelompok",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal menambahkan kelompok",
            })
        }

    } catch (error) {
        console.log("Add Kelompok Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.DeleteKelompok = async (req, res) => {
    try {
        const id = req.query.id;

        const check = await prisma.Kelompok.findFirst({
            where: {
                id
            }
        })

        if (!check) {
            return res.status(404).json({
                status: 404,
                message: `Kelompok tidak ditemukan!`,
            })
        }

        const data = await prisma.Kelompok.delete({
            where: {
                id
            }
        })

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil Delete kelompok",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal Delete kelompok",
            })
        }

    } catch (error) {
        console.log("Delete Kelompok Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.GetKelompok = async (req, res) => {
    try {
        const anggota = req.query.anggota;
        if (anggota === "true") {
            const data = await prisma.Kelompok.findMany({
                include: {
                    Anggota_Kelompok: true
                },
                orderBy: {
                    nomor: "asc"
                }
            })

            if (data.length > 0) {
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil mengambil Kelompok",
                    data
                })
            } else {
                return res.status(404).json({
                    status: 404,
                    message: "Kelompok tidak ditemukan",
                    data
                })
            }
        }
        const data = await prisma.Kelompok.findMany({
            orderBy: {
                nomor: "asc"
            }
        })

        if (data.length > 0) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil Kelompok",
                data
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: "Kelompok tidak ditemukan",
                data
            })
        }

    } catch (error) {
        console.log("Kumpul Kelompok Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.AddAnggotaKelompok = async (req, res) => {
    try {
        const { id_kelompok, nama, nim } = req.body;

        const check = await prisma.Anggota_Kelompok.findFirst({
            where: {
                nim
            }
        })
        if (check) {
            return res.status(400).json({
                status: 400,
                message: `Maba ( ${nim} ) sudah ada!`,
            })
        }
        const data = await prisma.Anggota_Kelompok.create({
            data: {
                id_kelompok,
                nama,
                nim
            }
        })

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil menambahkan anggota kelompok",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal menambahkan anggota kelompok",
                data
            })
        }

    } catch (error) {
        console.log("Add Kelompok Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}

//fungsi untuk generate QR code anggota
exports.GenerateAnggotaQR = async (req, res) => {
    try {
        // Ambil ID anggota dari parameter URL (contoh: /api/anggota/clxkbv50a000008l4g1j7b2c9/qr)
        const { anggotaId } = req.params;

        if (!anggotaId) {
            return res.status(400).json({ status: 400, message: "ID Anggota diperlukan" });
        }

        // Cari anggota di database untuk memastikan datanya valid
        const anggota = await prisma.Anggota_Kelompok.findUnique({
            where: { id: anggotaId }
        });

        if (!anggota) {
            return res.status(404).json({ status: 404, message: "Anggota tidak ditemukan" });
        }

        // Buat QR code dari ID unik anggota. Ini adalah data yang akan dibaca oleh scanner.
        const qrCodeDataURL = await qrcode.toDataURL(anggota.id);

        // Kirim respons berisi URL data QR code
        res.status(200).json({
            status: 200,
            message: `QR Code berhasil dibuat untuk ${anggota.nama}`,
            data: {
                anggota_id: anggota.id,
                nama: anggota.nama,
                nim: anggota.nim,
                qr_code_url: qrCodeDataURL // URL ini yang akan digunakan frontend untuk menampilkan gambar QR
            }
        });

    } catch (error) {
        console.error("Gagal membuat QR Code:", error);
        res.status(500).json({ status: 500, message: "Terjadi kesalahan pada server saat membuat QR Code" });
    }
};

exports.DeleteAnggotaKelompok = async (req, res) => {
    try {
        const id = req.query.id;

        const data = await prisma.Anggota_Kelompok.delete({
            where: {
                id
            }
        })

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil Delete Anggota kelompok",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal Delete Anggota kelompok"
            })
        }

    } catch (error) {
        console.log("Add Kelompok Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.EditAnggotaKelompok = async (req, res) => {
    try {
        const { id, nama, nim, id_kelompok } = req.body;
        console.log(req.body)

        const data = await prisma.Anggota_Kelompok.update({ where: { id }, data: { nama, nim, id_kelompok } })
        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Succesfully Edit Anggota Kelompok",
                data
            })
        }
        return res.status(300).json({
            status: 300,
            message: "Failed Edit Anggota Kelompok"
        })
    } catch (error) {
        console.log("Error in Edit Anggota Kelompok:", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.GetAnggotaKelompokById = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = 10;
        const skip = (page - 1) * limit;
        const kelompok = req.query.kelompok;

        if (page) {
            const data = await prisma.Anggota_Kelompok.findMany({
                take: limit,
                skip,
                where: {
                    id_kelompok: kelompok
                },
                orderBy: {
                    nim: "asc"
                },
                include: {
                    kelompok: true,
                    absensi: true
                }
            })

            const totalItems = await prisma.Anggota_Kelompok.count({
                where: {
                    id_kelompok: kelompok
                }
            })
            const totalPages = Math.ceil(totalItems / limit)

            if (data.length > 0) {
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil mengambil Anggota Kelompok",
                    data,
                    currentPage: page,
                    totalPages
                })
            } else {
                return res.status(404).json({
                    status: 404,
                    message: "Anggota Kelompok tidak ditemukan",
                })
            }
        }
        const data = await prisma.Anggota_Kelompok.findMany({
            where: {
                id_kelompok: kelompok
            },
            orderBy: {
                nim: "asc"
            },
            include: {
                kelompok: true,
                absensi: true
            }
        })

        if (data.length > 0) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil Anggota Kelompok",
                data
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: "Anggota Kelompok tidak ditemukan",
            })
        }

    } catch (error) {
        console.log("Kumpul Anggota Kelompok Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.GetSearchAnggotaKelompokById = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = 10;
        const skip = (page - 1) * limit;
        const kelompok = req.query.kelompok;
        const nama = req.query.nama;
        const nim = req.query.nim;

        if (page) {
            let data = []
            let totalItems = 0
            if (nama) {
                data = await prisma.Anggota_Kelompok.findMany({
                    where: {
                        nama: {
                            contains: nama,
                        },
                        id_kelompok: kelompok
                    },
                    take: limit,
                    skip: skip,
                    orderBy: {
                        nim: "asc"
                    },
                    include: {
                        kelompok: true,
                        absensi: true
                    }
                })
                totalItems = await prisma.Anggota_Kelompok.count({
                    where: {
                        nama: {
                            contains: nama,
                        },
                        id_kelompok: kelompok
                    }
                })
            } else if (nim) {
                data = await prisma.Anggota_kelompok.findMany({
                    take: limit,
                    skip,
                    where: {
                        nim: {
                            contains: nim,
                        },
                        id_kelompok: kelompok
                    },
                    orderBy: {
                        nim: "asc"
                    },
                    include: {
                        kelompok: true,
                        absensi: true
                    }
                })
                totalItems = await prisma.Anggota_Kelompok.count({
                    where: {
                        nim: {
                            contains: nim,
                        },
                        id_kelompok: kelompok
                    }
                })
            }

            const totalPages = Math.ceil(totalItems / limit)

            if (data.length > 0) {
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil mengambil Anggota Kelompok",
                    data,
                    currentPage: page,
                    totalPages
                })
            } else {
                return res.status(404).json({
                    status: 404,
                    message: "Anggota Kelompok tidak ditemukan",
                })
            }
        }
        let data = []
        if (nama) {
            data = await prisma.Anggota_Kelompok.findMany({
                where: {
                    nama: {
                        contains: nama,
                    },
                    id_kelompok: kelompok
                },
                orderBy: {
                    nim: "asc"
                },
                include: {
                    kelompok: true,
                    absensi: true
                }
            })
        } else if (nim) {
            data = await prisma.Anggota_Kelompok.findMany({
                where: {
                    nim: {
                        contains: nim,
                    },
                    id_kelompok: kelompok
                },
                orderBy: {
                    nim: "asc"
                },
                include: {
                    kelompok: true,
                    absensi: true
                }
            })
        }

        if (data.length > 0) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil Anggota Kelompok",
                data
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: "Anggota Kelompok tidak ditemukan",
            })
        }

    } catch (error) {
        console.log("Kumpul Anggota Kelompok Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.GetAllAnggotaKelompok = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = 10;
        const skip = (page - 1) * limit;
        if (page) {

            // const [data, totalItems] = await prisma.$transaction([
            //     prisma.Anggota_Kelompok.findMany({
            //         skip: skip,
            //         take: limit,
            //         include: {
            //             kelompok: true,
            //             absensi: true
            //         }
            //     }),
            //     prisma.Anggota_Kelompok.count()
            // ]);
            const data = await prisma.Anggota_Kelompok.findMany({
                skip: skip,
                take: limit,
                orderBy: {
                    nim: "asc"
                },
                include: {
                    kelompok: true,
                    absensi: true
                }
            })
            const totalItems = await prisma.Anggota_Kelompok.count()
            const totalPages = Math.ceil(totalItems / limit);

            if (data.length > 0) {
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil mengambil Anggota Kelompok",
                    data,
                    currentPage: page,
                    totalPages
                })
            } else {
                return res.status(404).json({
                    status: 404,
                    message: "Anggota Kelompok tidak ditemukan",
                })
            }
        }
        const data = await prisma.Anggota_Kelompok.findMany({
            orderBy: {
                nim: "asc"
            },
            include: {
                kelompok: true,
                absensi: true
            }
        })

        if (data.length > 0) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil Anggota Kelompok",
                data,
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: "Anggota Kelompok tidak ditemukan",
            })
        }

    } catch (error) {
        console.log("Kumpul Anggota Kelompok Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}

// Get anggota kelompok with their absensi status for specific kegiatan
exports.GetAnggotaKelompokWithAbsensi = async (req, res) => {
    try {
        const { id_kelompok, id_absen } = req.query;

        if (!id_kelompok || !id_absen) {
            return res.status(400).json({
                status: 400,
                message: "id_kelompok dan id_absen diperlukan"
            });
        }

        // Get all anggota in kelompok with their absensi status for the specific kegiatan
        const anggotaKelompok = await prisma.Anggota_Kelompok.findMany({
            where: {
                id_kelompok: id_kelompok
            },
            include: {
                kelompok: true,
                absensi: {
                    where: {
                        id_absen: id_absen
                    }
                }
            },
            orderBy: {
                nama: "asc"
            }
        });

        // Transform data to include status kehadiran
        const transformedData = anggotaKelompok.map(anggota => {
            const absensiRecord = anggota.absensi[0]; // Should only be one record per student per kegiatan
            
            return {
                id: anggota.id,
                nama: anggota.nama,
                nim: anggota.nim,
                kelompok_nomor: anggota.kelompok.nomor,
                status_kehadiran: absensiRecord ? absensiRecord.keterangan : null,
                waktu_absen: absensiRecord ? absensiRecord.createAt : null,
                metode_absen: absensiRecord ? absensiRecord.metode : null,
                alasan: absensiRecord ? absensiRecord.alasan : null
            };
        });

        return res.status(200).json({
            status: 200,
            message: "Berhasil mengambil data anggota kelompok dengan status absensi",
            data: transformedData
        });

    } catch (error) {
        console.log("Get Anggota Kelompok With Absensi Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

// Get anggota by NIM - for QR generation
exports.GetAnggotaByNim = async (req, res) => {
    try {
        const { nim } = req.params;

        if (!nim) {
            return res.status(400).json({
                status: 400,
                message: "NIM diperlukan"
            });
        }

        const anggota = await prisma.Anggota_Kelompok.findUnique({
            where: {
                nim: nim
            },
            include: {
                kelompok: true
            }
        });

        if (!anggota) {
            return res.status(404).json({
                status: 404,
                message: `Anggota dengan NIM ${nim} tidak ditemukan`
            });
        }

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Berhasil mengambil data anggota",
            data: anggota
        });

    } catch (error) {
        console.log("Get Anggota By NIM Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
}