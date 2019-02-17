require "pdf-reader"

reader = PDF::Reader.new("recycle-list.pdf")

reader.pages.each do |page|
  content = page.text
  content.split("\n").each do |line|
    if line.size > 0
      puts line.split(/  +/).join("|")
    end
  end
end
